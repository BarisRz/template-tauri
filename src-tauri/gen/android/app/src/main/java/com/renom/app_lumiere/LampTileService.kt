package com.renom.app_lumiere

import android.os.Build
import android.os.Handler
import android.os.Looper
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService
import java.util.concurrent.Executors

// Tuile Quick Settings : affiche l'état de la lampe et l'allume / l'éteint au toucher.
// Elle parle directement à la lampe, l'app n'a pas besoin d'être ouverte.
class LampTileService : TileService() {
  private val executor = Executors.newSingleThreadExecutor()
  private val mainHandler = Handler(Looper.getMainLooper())

  override fun onStartListening() {
    super.onStartListening()
    runAndUpdate { LampClient.isOn() }
  }

  override fun onClick() {
    super.onClick()
    runAndUpdate {
      val turnOn = !LampClient.isOn()
      LampClient.setPower(turnOn)
      turnOn
    }
  }

  override fun onDestroy() {
    executor.shutdownNow()
    super.onDestroy()
  }

  // Le réseau est interdit sur le thread principal : on l'appelle à part,
  // puis on met à jour la tuile (null = lampe injoignable)
  private fun runAndUpdate(action: () -> Boolean) {
    executor.execute {
      val isOn = runCatching(action).getOrNull()
      mainHandler.post { updateTile(isOn) }
    }
  }

  private fun updateTile(isOn: Boolean?) {
    val tile = qsTile ?: return
    tile.state = when (isOn) {
      true -> Tile.STATE_ACTIVE
      false -> Tile.STATE_INACTIVE
      null -> Tile.STATE_UNAVAILABLE
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      tile.subtitle = getString(
        when (isOn) {
          true -> R.string.tile_on
          false -> R.string.tile_off
          null -> R.string.tile_unreachable
        }
      )
    }
    tile.updateTile()
  }
}
