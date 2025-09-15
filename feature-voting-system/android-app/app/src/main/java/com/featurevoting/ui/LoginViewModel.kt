package com.featurevoting.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.featurevoting.api.NetworkManager
import com.featurevoting.models.LoginRequest
import com.featurevoting.models.LoginResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {

    private val _loginState = MutableStateFlow<LoginState>(LoginState.Idle)
    val loginState: StateFlow<LoginState> = _loginState

    sealed class LoginState {
        object Idle : LoginState()
        object Loading : LoginState()
        data class Success(val loginResponse: LoginResponse) : LoginState()
        data class Error(val message: String) : LoginState()
    }

    fun login(username: String) {
        viewModelScope.launch {
            _loginState.value = LoginState.Loading
            try {
                val response = NetworkManager.apiService.login(LoginRequest(username))
                if (response.isSuccessful && response.body() != null) {
                    _loginState.value = LoginState.Success(response.body()!!)
                } else {
                    _loginState.value = LoginState.Error("Login failed: User not found")
                }
            } catch (e: Exception) {
                _loginState.value = LoginState.Error("Network error: ${e.message}")
            }
        }
    }
}