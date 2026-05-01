package com.bookswap.mobile.network

import com.bookswap.mobile.data.BookItem
import com.bookswap.mobile.data.LoginRequest
import com.bookswap.mobile.data.TokenResponse
import com.bookswap.mobile.data.UserProfile
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

data class HealthResponse(
    val status: String
)

interface ApiService {
    @GET("health/")
    suspend fun health(): HealthResponse

    @POST("auth/login/")
    suspend fun login(@Body request: LoginRequest): TokenResponse

    @GET("auth/me/")
    suspend fun me(): UserProfile

    @GET("books/")
    suspend fun books(): List<BookItem>
}
