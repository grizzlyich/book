package com.bookswap.mobile.data

data class LoginRequest(val username: String, val password: String)
data class TokenResponse(val access: String, val refresh: String)

data class UserProfile(val id: Int, val username: String, val city: String?)

data class BookItem(
    val id: Int,
    val title: String,
    val author: String,
    val city: String?,
    val genre: String?,
    val status: String
)

data class ExchangeItem(
    val id: Int,
    val status: String,
    val message: String?,
    val created_at: String?
)

data class ReviewItem(
    val id: Int,
    val rating: Int,
    val comment: String?,
    val created_at: String?
)

data class PaginatedResponse<T>(
    val count: Int,
    val next: String?,
    val previous: String?,
    val results: List<T>
)
