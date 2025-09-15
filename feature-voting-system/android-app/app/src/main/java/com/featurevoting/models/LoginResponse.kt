package com.featurevoting.models

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("user_id")
    val userId: Int,
    val username: String
)