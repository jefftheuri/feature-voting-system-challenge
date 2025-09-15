package com.featurevoting.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.featurevoting.R
import com.featurevoting.databinding.ItemFeatureBinding
import com.featurevoting.models.Feature

class FeatureAdapter(
    private val onVoteClick: (Feature) -> Unit
) : ListAdapter<Feature, FeatureAdapter.FeatureViewHolder>(FeatureDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FeatureViewHolder {
        val binding = ItemFeatureBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return FeatureViewHolder(binding)
    }

    override fun onBindViewHolder(holder: FeatureViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class FeatureViewHolder(
        private val binding: ItemFeatureBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(feature: Feature) {
            binding.apply {
                tvTitle.text = feature.title
                tvAuthor.text = "by ${feature.creator}"

                if (feature.description.isNullOrBlank()) {
                    tvDescription.visibility = View.GONE
                } else {
                    tvDescription.visibility = View.VISIBLE
                    tvDescription.text = feature.description
                }

                val voteText = if (feature.voteCount == 1) "1 vote" else "${feature.voteCount} votes"
                tvVoteCount.text = voteText

                // Update vote button based on user's vote status
                if (feature.isVoted) {
                    btnVote.text = "Remove Vote"
                    btnVote.setBackgroundColor(
                        ContextCompat.getColor(root.context, R.color.purple_700)
                    )
                    btnVote.setTextColor(
                        ContextCompat.getColor(root.context, android.R.color.white)
                    )
                } else {
                    btnVote.text = "Vote"
                    btnVote.setBackgroundColor(
                        ContextCompat.getColor(root.context, android.R.color.transparent)
                    )
                    btnVote.setTextColor(
                        ContextCompat.getColor(root.context, R.color.purple_700)
                    )
                }

                btnVote.setOnClickListener {
                    onVoteClick(feature)
                }
            }
        }
    }

    class FeatureDiffCallback : DiffUtil.ItemCallback<Feature>() {
        override fun areItemsTheSame(oldItem: Feature, newItem: Feature): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Feature, newItem: Feature): Boolean {
            return oldItem == newItem
        }
    }
}