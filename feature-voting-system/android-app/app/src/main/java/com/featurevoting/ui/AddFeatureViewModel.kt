package com.featurevoting.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.featurevoting.api.NetworkManager
import com.featurevoting.models.CreateFeatureRequest
import com.featurevoting.models.Feature
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AddFeatureViewModel : ViewModel() {

    private val _createState = MutableStateFlow<CreateState>(CreateState.Idle)
    val createState: StateFlow<CreateState> = _createState

    sealed class CreateState {
        object Idle : CreateState()
        object Loading : CreateState()
        data class Success(val feature: Feature) : CreateState()
        data class Error(val message: String) : CreateState()
    }

    fun createFeature(title: String, description: String) {
        viewModelScope.launch {
            _createState.value = CreateState.Loading
            try {
                val response = NetworkManager.apiService.createFeature(
                    CreateFeatureRequest(title, description)
                )
                if (response.isSuccessful && response.body() != null) {
                    _createState.value = CreateState.Success(response.body()!!)
                } else {
                    _createState.value = CreateState.Error("Failed to create feature")
                }
            } catch (e: Exception) {
                _createState.value = CreateState.Error("Network error: ${e.message}")
            }
        }
    }
}