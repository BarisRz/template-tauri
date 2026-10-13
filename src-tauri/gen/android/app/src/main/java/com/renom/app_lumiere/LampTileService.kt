package com.renom.app_lumiere

import android.os.Build
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

// Tuile Quick Settings : affiche l'état de la lampe et l'allume / l'éteint au toucher.
// Elle reste toujours cliquable, même si la lampe n'a pas répondu à la dernière vérification.
class LampTileService : TileService() {

  override fun onStartListening() {
    super.onStartListening()
    render()
    // Évite de revérifier en boucle : la fin d'une vérification redessine la tuile
    if (System.currentTimeMillis() - LampStore.read(this).checkedAt > REFRESH_AFTER_MS) {
      LampWorker.refresh(this)
    }
  }

  override fun onClick() {
    super.onClick()
    LampStore.saveOptimistic(this, isOn = LampStore.read(this).isOn != true)
    render()
    LampWidgetProvider.updateAll(this)
    LampWorker.toggle(this)
  }

  private fun render() {
    val tile = qsTile ?: return
    val state = LampStore.read(this)
    tile.state = if (state.isOn == true) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      tile.subtitle = getString(
        when {
          !state.reachable -> R.string.tile_unreachable
          state.isOn == true -> R.string.tile_on
          else -> R.string.tile_off
        }
      )
    }
    tile.updateTile()
  }

  companion object {
    private const val REFRESH_AFTER_MS = 10_000L
  }
}
