package com.featurevoting.models

import com.google.gson.annotations.SerializedName

data class Feature(
    val id: Int,
    val title: String,
    val description: String?,
    @SerializedName("created_at")
    val createdAt: String,
    val creator: String,
    @SerializedName("vote_count")
    val voteCount: Int,
    var isVoted: Boolean = false
)