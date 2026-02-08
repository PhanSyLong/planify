package com.planify.backend.repository;

import com.planify.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {

    Optional<Tag> findByTagName(String tagName);

    List<Tag> findByCategory(String category);

    List<Tag> findByTagNameIn(List<String> tagNames);
}
