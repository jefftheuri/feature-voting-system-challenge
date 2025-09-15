package com.featurevoting.api

import com.featurevoting.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @POST("login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("features")
    suspend fun getFeatures(): Response<List<Feature>>

    @POST("features")
    suspend fun createFeature(@Body request: CreateFeatureRequest): Response<Feature>

    @POST("features/{id}/vote")
    suspend fun voteFeature(@Path("id") featureId: Int): Response<ApiResponse>

    @DELETE("features/{id}/vote")
    suspend fun removeVote(@Path("id") featureId: Int): Response<ApiResponse>
}