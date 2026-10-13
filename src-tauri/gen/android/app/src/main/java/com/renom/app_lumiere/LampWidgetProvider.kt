package com.renom.app_lumiere

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews

// Widget d'écran d'accueil : on/off et luminosité minimale / maximale
class LampWidgetProvider : AppWidgetProvider() {

  override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
    render(context, manager, ids)
    LampWorker.schedulePeriodic(context)
    LampWorker.refresh(context)
  }

  override fun onEnabled(context: Context) {
    LampWorker.schedulePeriodic(context)
  }

  override fun onDisabled(context: Context) {
    LampWorker.cancelPeriodic(context)
  }

  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    when (intent.action) {
      ACTION_TOGGLE -> {
        LampStore.saveOptimistic(context, isOn = LampStore.read(context).isOn != true)
        LampWorker.refreshViews(context)
        LampWorker.toggle(context)
      }
      ACTION_SET_BRIGHT -> {
        val bright = intent.getIntExtra(EXTRA_BRIGHT, BRIGHT_MAX)
        LampStore.saveOptimistic(context, isOn = true, bright = bright)
        LampWorker.refreshViews(context)
        LampWorker.setBright(context, bright)
      }
    }
  }

  companion object {
    private const val ACTION_TOGGLE = "com.renom.app_lumiere.widget.TOGGLE"
    private const val ACTION_SET_BRIGHT = "com.renom.app_lumiere.widget.SET_BRIGHT"
    private const val EXTRA_BRIGHT = "bright"

    // La lampe refuse 0 % : 1 % est sa luminosité minimale
    private const val BRIGHT_MIN = 1
    private const val BRIGHT_MAX = 100

    fun updateAll(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val ids = manager.getAppWidgetIds(ComponentName(context, LampWidgetProvider::class.java))
      render(context, manager, ids)
    }

    private fun render(context: Context, manager: AppWidgetManager, ids: IntArray) {
      if (ids.isEmpty()) return
      val views = buildViews(context)
      ids.forEach { manager.updateAppWidget(it, views) }
    }

    private fun buildViews(context: Context): RemoteViews {
      val state = LampStore.read(context)
      val isOn = state.isOn == true

      return RemoteViews(context.packageName, R.layout.widget_lamp).apply {
        setButtonActive(context, R.id.widget_power, isOn, isIcon = true)
        setButtonActive(context, R.id.widget_bright_min, isOn && state.bright == BRIGHT_MIN)
        setButtonActive(context, R.id.widget_bright_max, isOn && state.bright == BRIGHT_MAX)
        setInt(R.id.widget_power, "setImageAlpha", if (state.reachable) 255 else 110)

        setOnClickPendingIntent(R.id.widget_power, clickIntent(context, 0, ACTION_TOGGLE))
        setOnClickPendingIntent(
          R.id.widget_bright_min, clickIntent(context, 1, ACTION_SET_BRIGHT, BRIGHT_MIN),
        )
        setOnClickPendingIntent(
          R.id.widget_bright_max, clickIntent(context, 2, ACTION_SET_BRIGHT, BRIGHT_MAX),
        )
      }
    }

    // Bouton actif : couleur pleine. Les couleurs sont passées en ressources pour que le
    // lanceur les recalcule quand le thème ou les couleurs du téléphone changent.
    private fun RemoteViews.setButtonActive(
      context: Context,
      viewId: Int,
      active: Boolean,
      isIcon: Boolean = false,
    ) {
      val background = if (active) R.drawable.widget_button_active else R.drawable.widget_button
      val foreground = if (active) R.color.widget_on_active else R.color.widget_on_button
      setInt(viewId, "setBackgroundResource", background)

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        setColorStateList(viewId, if (isIcon) "setImageTintList" else "setTextColor", foreground)
      } else if (isIcon) {
        setInt(viewId, "setColorFilter", context.getColor(foreground))
      } else {
        setTextColor(viewId, context.getColor(foreground))
      }
    }

    private fun clickIntent(
      context: Context,
      requestCode: Int,
      action: String,
      bright: Int? = null,
    ): PendingIntent {
      val intent = Intent(context, LampWidgetProvider::class.java).setAction(action)
      if (bright != null) intent.putExtra(EXTRA_BRIGHT, bright)
      return PendingIntent.getBroadcast(
        context, requestCode, intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
    }
  }
}
