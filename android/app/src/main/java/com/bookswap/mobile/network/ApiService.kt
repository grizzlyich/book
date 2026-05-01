package com.bookswap.mobile.network

import retrofit2.http.GET

data class HealthResponse(
    val status: String
)

interface ApiService {
    @GET("health/")
    suspend fun health(): HealthResponse
}
