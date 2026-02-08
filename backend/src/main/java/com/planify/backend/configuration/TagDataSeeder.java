package com.planify.backend.configuration;

import com.planify.backend.model.Tag;
import com.planify.backend.repository.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class TagDataSeeder implements CommandLineRunner {

    private final TagRepository tagRepository;

    // TAG_GROUPS matching frontend ExploreTags.jsx
    private static final Map<String, List<String>> TAG_GROUPS = Map.of(
            "subject", Arrays.asList(
                    "Math", "Physics", "Chemistry", "Literature", "English",
                    "Biology", "History", "Geography", "Computer Science"),
            "certificate", Arrays.asList(
                    "IELTS", "TOEIC", "VSTEP", "SAT", "IELTS UKVI", "TOPIK"),
            "other", Arrays.asList(
                    "Soft Skills", "Programming", "Design", "Marketing", "Foreign Languages"));

    public TagDataSeeder(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed if tag table is empty
        if (tagRepository.count() == 0) {
            seedTags();
            System.out.println("TagDataSeeder: Seeded " + tagRepository.count() + " tags successfully.");
        } else {
            System.out.println("TagDataSeeder: Tags already exist, skipping seed.");
        }
    }

    private void seedTags() {
        TAG_GROUPS.forEach((category, tagNames) -> {
            tagNames.forEach(tagName -> {
                Tag tag = new Tag();
                tag.setTagName(tagName);
                tag.setCategory(category);
                tagRepository.save(tag);
            });
        });
    }
}
