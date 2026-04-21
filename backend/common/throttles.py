from rest_framework.throttling import ScopedRateThrottle


class RegisterThrottle(ScopedRateThrottle):
    scope = 'register'


class LoginThrottle(ScopedRateThrottle):
    scope = 'login'


class UploadThrottle(ScopedRateThrottle):
    scope = 'upload'
