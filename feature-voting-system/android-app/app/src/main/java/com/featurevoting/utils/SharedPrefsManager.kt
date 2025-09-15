package com.featurevoting.utils

import android.content.Context
import android.content.SharedPreferences
import com.featurevoting.models.User

class SharedPrefsManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "feature_voting_prefs"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USERNAME = "username"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
    }

    fun saveUser(user: User) {
        prefs.edit().apply {
            putInt(KEY_USER_ID, user.userId)
            putString(KEY_USERNAME, user.username)
            putBoolean(KEY_IS_LOGGED_IN, true)
            apply()
        }
    }

    fun getUser(): User? {
        return if (isLoggedIn()) {
            User(
                userId = prefs.getInt(KEY_USER_ID, -1),
                username = prefs.getString(KEY_USERNAME, "") ?: ""
            )
        } else {
            null
        }
    }

    fun isLoggedIn(): Boolean {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false)
    }

    fun clearUser() {
        prefs.edit().clear().apply()
    }
}