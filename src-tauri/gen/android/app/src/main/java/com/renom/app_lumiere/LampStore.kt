package com.renom.app_lumiere

import android.content.Context

// Dernier état connu de la lampe, partagé par la tuile et le widget
// pour s'afficher instantanément sans attendre le réseau
object LampStore {
  data class Snapshot(
    val isOn: Boolean?,
    val bright: Int,
    val reachable: Boolean,
    val checkedAt: Long,
  )

  private fun prefs(context: Context) =
    context.getSharedPreferences("lamp_state", Context.MODE_PRIVATE)

  fun read(context: Context): Snapshot {
    val prefs = prefs(context)
    return Snapshot(
      isOn = if (prefs.contains("is_on")) prefs.getBoolean("is_on", false) else null,
      bright = prefs.getInt("bright", 100),
      reachable = prefs.getBoolean("reachable", true),
      checkedAt = prefs.getLong("checked_at", 0L),
    )
  }

  fun save(context: Context, state: LampClient.State) {
    prefs(context).edit()
      .putBoolean("is_on", state.isOn)
      .putInt("bright", state.bright)
      .putBoolean("reachable", true)
      .putLong("checked_at", System.currentTimeMillis())
      .apply()
  }

  fun markUnreachable(context: Context) {
    prefs(context).edit()
      .putBoolean("reachable", false)
      .putLong("checked_at", System.currentTimeMillis())
      .apply()
  }

  // Affichage immédiat après un appui, corrigé ensuite par l'état réel de la lampe
  fun saveOptimistic(context: Context, isOn: Boolean, bright: Int? = null) {
    val editor = prefs(context).edit().putBoolean("is_on", isOn)
    if (bright != null) editor.putInt("bright", bright)
    editor.apply()
  }
}
