package com.featurevoting.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.featurevoting.databinding.ActivityAddFeatureBinding
import kotlinx.coroutines.launch

class AddFeatureActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddFeatureBinding
    private val viewModel: AddFeatureViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddFeatureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        setupViews()
        observeViewModel()
    }

    private fun setupViews() {
        binding.btnCancel.setOnClickListener {
            finish()
        }

        binding.btnCreate.setOnClickListener {
            val title = binding.etTitle.text.toString().trim()
            val description = binding.etDescription.text.toString().trim()

            if (title.isNotEmpty()) {
                viewModel.createFeature(title, description)
            } else {
                Toast.makeText(this, "Please enter a feature title", Toast.LENGTH_SHORT).show()
            }
        }

        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            viewModel.createState.collect { state ->
                when (state) {
                    is AddFeatureViewModel.CreateState.Idle -> {
                        binding.progressBar.visibility = View.GONE
                        binding.btnCreate.isEnabled = true
                        binding.btnCancel.isEnabled = true
                    }
                    is AddFeatureViewModel.CreateState.Loading -> {
                        binding.progressBar.visibility = View.VISIBLE
                        binding.btnCreate.isEnabled = false
                        binding.btnCancel.isEnabled = false
                    }
                    is AddFeatureViewModel.CreateState.Success -> {
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(this@AddFeatureActivity, "Feature created successfully!", Toast.LENGTH_SHORT).show()
                        finish()
                    }
                    is AddFeatureViewModel.CreateState.Error -> {
                        binding.progressBar.visibility = View.GONE
                        binding.btnCreate.isEnabled = true
                        binding.btnCancel.isEnabled = true
                        Toast.makeText(this@AddFeatureActivity, state.message, Toast.LENGTH_LONG).show()
                    }
                }
            }
        }
    }
}