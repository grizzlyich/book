package com.bookswap.mobile.network

object AuthStore {
    @Volatile var accessToken: String? = null
    @Volatile var refreshToken: String? = null

    fun clear() {
        accessToken = null
        refreshToken = null
    }
}
