package com.featurevoting.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.featurevoting.api.NetworkManager
import com.featurevoting.models.Feature
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState

    data class UiState(
        val isLoading: Boolean = false,
        val features: List<Feature> = emptyList(),
        val error: String? = null
    )

    fun loadFeatures() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            try {
                val response = NetworkManager.apiService.getFeatures()
                if (response.isSuccessful && response.body() != null) {
                    val features = response.body()!!
                    // Determine which features the user has voted for
                    updateVoteStatus(features)
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        features = features
                    )
                } else {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Failed to load features"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = "Network error: ${e.message}"
                )
            }
        }
    }

    private suspend fun updateVoteStatus(features: List<Feature>) {
        // Check vote status for each feature by attempting to vote
        features.forEach { feature ->
            try {
                val voteResponse = NetworkManager.apiService.voteFeature(feature.id)
                if (voteResponse.code() == 409) {
                    // User already voted
                    feature.isVoted = true
                } else if (voteResponse.isSuccessful) {
                    // Vote was successful, now remove it to restore original state
                    NetworkManager.apiService.removeVote(feature.id)
                    feature.isVoted = false
                }
            } catch (e: Exception) {
                // Assume not voted if error
                feature.isVoted = false
            }
        }
    }

    fun toggleVote(feature: Feature) {
        viewModelScope.launch {
            try {
                val response = if (feature.isVoted) {
                    NetworkManager.apiService.removeVote(feature.id)
                } else {
                    NetworkManager.apiService.voteFeature(feature.id)
                }

                if (response.isSuccessful) {
                    // Update local state
                    feature.isVoted = !feature.isVoted
                    // Reload features to get updated vote counts
                    loadFeatures()
                } else {
                    _uiState.value = _uiState.value.copy(
                        error = "Failed to update vote"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = "Network error: ${e.message}"
                )
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}