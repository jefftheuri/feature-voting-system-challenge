package com.featurevoting.ui

import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.featurevoting.R
import com.featurevoting.databinding.ActivityMainBinding
import com.featurevoting.models.Feature
import com.featurevoting.utils.SharedPrefsManager
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var adapter: FeatureAdapter
    private lateinit var sharedPrefsManager: SharedPrefsManager
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPrefsManager = SharedPrefsManager(this)
        setSupportActionBar(binding.toolbar)

        setupRecyclerView()
        setupViews()
        observeViewModel()

        viewModel.loadFeatures()
    }

    private fun setupRecyclerView() {
        adapter = FeatureAdapter { feature ->
            viewModel.toggleVote(feature)
        }

        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = this@MainActivity.adapter
        }
    }

    private fun setupViews() {
        binding.swipeRefresh.setOnRefreshListener {
            viewModel.loadFeatures()
        }

        binding.fabAddFeature.setOnClickListener {
            startActivity(Intent(this, AddFeatureActivity::class.java))
        }
    }

    private fun observeViewModel() {
        lifecycleScope.launch {
            viewModel.uiState.collect { state ->
                binding.progressBar.visibility = if (state.isLoading) View.VISIBLE else View.GONE
                binding.swipeRefresh.isRefreshing = false

                adapter.submitList(state.features)

                state.error?.let { error ->
                    Toast.makeText(this@MainActivity, error, Toast.LENGTH_LONG).show()
                    viewModel.clearError()
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        viewModel.loadFeatures()
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        val user = sharedPrefsManager.getUser()
        menu.findItem(R.id.action_user)?.title = "Welcome, ${user?.username}!"
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
                logout()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun logout() {
        sharedPrefsManager.clearUser()
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}