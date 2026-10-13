package com.renom.app_lumiere

import org.json.JSONObject
import java.net.InetSocketAddress
import java.net.Socket

// Client minimal du protocole Yeelight, pour la même lampe que src-tauri/src/lamp.rs
object LampClient {
  private const val IP = "192.168.1.85"
  private const val PORT = 55443
  private const val TIMEOUT_MS = 3000
  private const val RETRY_DELAY_MS = 700L

  data class State(val isOn: Boolean, val bright: Int)

  fun getState(): State {
    val result = send("get_prop", "[\"power\",\"bright\"]").getJSONArray("result")
    return State(result.getString(0) == "on", result.getString(1).toIntOrNull() ?: 100)
  }

  fun setPower(on: Boolean) {
    send("set_power", "[\"${if (on) "on" else "off"}\",\"smooth\",500]")
  }

  fun setBright(bright: Int) {
    send("set_bright", "[$bright,\"smooth\",300]")
  }

  // Le réseau peut être indisponible quelques instants quand l'app sort de l'arrière-plan :
  // on retente avant d'abandonner
  fun <T> withRetry(attempts: Int = 3, block: () -> T): T {
    var lastError: Exception? = null
    repeat(attempts) { attempt ->
      try {
        return block()
      } catch (e: Exception) {
        lastError = e
        if (attempt < attempts - 1) Thread.sleep(RETRY_DELAY_MS)
      }
    }
    throw lastError!!
  }

  private fun send(method: String, params: String): JSONObject {
    Socket().use { socket ->
      socket.connect(InetSocketAddress(IP, PORT), TIMEOUT_MS)
      socket.soTimeout = TIMEOUT_MS
      socket.getOutputStream()
        .write("{\"id\":1,\"method\":\"$method\",\"params\":$params}\r\n".toByteArray())

      val response = JSONObject(socket.getInputStream().bufferedReader().readLine())
      if (response.has("error")) throw IllegalStateException("Erreur lampe : $response")
      return response
    }
  }
}
