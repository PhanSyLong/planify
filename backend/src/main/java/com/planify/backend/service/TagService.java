package com.planify.backend.service;

import com.planify.backend.model.Plan;
import com.planify.backend.model.Tag;
import com.planify.backend.model.TagPlan;
import com.planify.backend.repository.PlanRepository;
import com.planify.backend.repository.TagPlanRepository;
import com.planify.backend.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final TagPlanRepository tagPlanRepository;
    private final PlanRepository planRepository;

    public TagService(TagRepository tagRepository, TagPlanRepository tagPlanRepository, PlanRepository planRepository) {
        this.tagRepository = tagRepository;
        this.tagPlanRepository = tagPlanRepository;
        this.planRepository = planRepository;
    }

    /**
     * Get all tags grouped by category
     */
    public Map<String, List<String>> getAllTagsGrouped() {
        List<Tag> allTags = tagRepository.findAll();

        Map<String, List<String>> grouped = new HashMap<>();
        grouped.put("subject", allTags.stream()
                .filter(t -> "subject".equals(t.getCategory()))
                .map(Tag::getTagName)
                .collect(Collectors.toList()));
        grouped.put("certificate", allTags.stream()
                .filter(t -> "certificate".equals(t.getCategory()))
                .map(Tag::getTagName)
                .collect(Collectors.toList()));
        grouped.put("other", allTags.stream()
                .filter(t -> "other".equals(t.getCategory()))
                .map(Tag::getTagName)
                .collect(Collectors.toList()));

        return grouped;
    }

    /**
     * Get all tag names for a specific plan
     */
    public List<String> getTagsByPlanId(Integer planId) {
        List<TagPlan> tagPlans = tagPlanRepository.findByPlanId(planId);
        return tagPlans.stream()
                .map(tp -> tp.getTag().getTagName())
                .collect(Collectors.toList());
    }

    /**
     * Set tags for a plan (only adds/removes changed tags, preserves unchanged
     * ones)
     */
    @Transactional
    public List<String> setTagsForPlan(Integer planId, List<String> newTagNames) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found: " + planId));

        // Get existing tag associations for this plan
        List<TagPlan> existingTagPlans = tagPlanRepository.findByPlanId(planId);

        // Extract existing tag names
        List<String> existingTagNames = existingTagPlans.stream()
                .map(tp -> tp.getTag().getTagName())
                .collect(Collectors.toList());

        // Find tags to add (in newTagNames but not in existingTagNames)
        List<String> tagsToAdd = newTagNames.stream()
                .filter(name -> !existingTagNames.contains(name))
                .collect(Collectors.toList());

        // Find tags to remove (in existingTagNames but not in newTagNames)
        List<TagPlan> tagPlansToRemove = existingTagPlans.stream()
                .filter(tp -> !newTagNames.contains(tp.getTag().getTagName()))
                .collect(Collectors.toList());

        // Remove tags that are no longer selected
        for (TagPlan tagPlan : tagPlansToRemove) {
            tagPlanRepository.delete(tagPlan);
        }

        // Add new tags
        if (!tagsToAdd.isEmpty()) {
            List<Tag> newTags = tagRepository.findByTagNameIn(tagsToAdd);
            for (Tag tag : newTags) {
                TagPlan tagPlan = new TagPlan();
                tagPlan.setPlan(plan);
                tagPlan.setTag(tag);
                tagPlanRepository.save(tagPlan);
            }
        }

        // Return the final list of tags
        return newTagNames;
    }
}
