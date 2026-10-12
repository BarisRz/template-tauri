package com.renom.app_lumiere

import org.json.JSONObject
import java.net.InetSocketAddress
import java.net.Socket

// Client minimal du protocole Yeelight, pour la même lampe que src-tauri/src/lamp.rs
object LampClient {
  private const val IP = "192.168.1.85"
  private const val PORT = 55443
  private const val TIMEOUT_MS = 3000

  fun isOn(): Boolean =
    send("get_prop", "[\"power\"]").getJSONArray("result").getString(0) == "on"

  fun setPower(on: Boolean) {
    send("set_power", "[\"${if (on) "on" else "off"}\",\"smooth\",500]")
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
