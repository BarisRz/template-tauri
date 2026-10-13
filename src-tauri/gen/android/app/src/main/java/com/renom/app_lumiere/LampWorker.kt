package com.renom.app_lumiere

import android.content.ComponentName
import android.content.Context
import android.os.Build
import android.service.quicksettings.TileService
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.OutOfQuotaPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import java.util.concurrent.TimeUnit

// Toutes les commandes de la tuile et du widget passent par WorkManager :
// Android garantit l'accès réseau pendant l'exécution, même quand l'app est en arrière-plan.
class LampWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

  override fun doWork(): Result {
    val context = applicationContext
    try {
      when (inputData.getString(KEY_ACTION)) {
        ACTION_TOGGLE -> {
          val turnOn = !LampClient.withRetry { LampClient.getState() }.isOn
          LampClient.withRetry { LampClient.setPower(turnOn) }
        }
        ACTION_SET_BRIGHT -> {
          if (!LampClient.withRetry { LampClient.getState() }.isOn) {
            LampClient.withRetry { LampClient.setPower(true) }
          }
          val bright = inputData.getInt(KEY_BRIGHT, 100)
          LampClient.withRetry { LampClient.setBright(bright) }
        }
      }
      LampStore.save(context, LampClient.withRetry { LampClient.getState() })
    } catch (e: Exception) {
      LampStore.markUnreachable(context)
    }
    refreshViews(context)
    return Result.success()
  }

  companion object {
    private const val KEY_ACTION = "action"
    private const val KEY_BRIGHT = "bright"
    private const val ACTION_REFRESH = "refresh"
    private const val ACTION_TOGGLE = "toggle"
    private const val ACTION_SET_BRIGHT = "set_bright"

    fun refresh(context: Context) =
      enqueue(context, "lamp-refresh", ExistingWorkPolicy.KEEP, ACTION_REFRESH)

    fun toggle(context: Context) =
      enqueue(context, "lamp-action", ExistingWorkPolicy.APPEND_OR_REPLACE, ACTION_TOGGLE)

    fun setBright(context: Context, bright: Int) =
      enqueue(context, "lamp-action", ExistingWorkPolicy.APPEND_OR_REPLACE, ACTION_SET_BRIGHT, bright)

    // Vérification de l'état environ toutes les 15 minutes (minimum imposé par Android)
    fun schedulePeriodic(context: Context) {
      val request = PeriodicWorkRequestBuilder<LampWorker>(15, TimeUnit.MINUTES)
        .setConstraints(networkConstraint)
        .setInputData(workDataOf(KEY_ACTION to ACTION_REFRESH))
        .build()
      WorkManager.getInstance(context)
        .enqueueUniquePeriodicWork("lamp-periodic", ExistingPeriodicWorkPolicy.KEEP, request)
    }

    fun cancelPeriodic(context: Context) {
      WorkManager.getInstance(context).cancelUniqueWork("lamp-periodic")
    }

    // Met à jour le widget et demande à la tuile de se redessiner
    fun refreshViews(context: Context) {
      LampWidgetProvider.updateAll(context)
      TileService.requestListeningState(
        context,
        ComponentName(context, LampTileService::class.java),
      )
    }

    private val networkConstraint =
      Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()

    private fun enqueue(
      context: Context,
      name: String,
      policy: ExistingWorkPolicy,
      action: String,
      bright: Int? = null,
    ) {
      val data = if (bright != null) {
        workDataOf(KEY_ACTION to action, KEY_BRIGHT to bright)
      } else {
        workDataOf(KEY_ACTION to action)
      }
      val builder = OneTimeWorkRequestBuilder<LampWorker>()
        .setConstraints(networkConstraint)
        .setInputData(data)
      // Exécution immédiate (avant Android 12, cela exigerait une notification)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        builder.setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
      }
      WorkManager.getInstance(context).enqueueUniqueWork(name, policy, builder.build())
    }
  }
}
