package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "tag") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; //

    @Column(name = "tag_name", nullable = false, length = 120)
    private String tagName;

    @Column(name = "category", nullable = false,columnDefinition = "ENUM('subject', 'certificate', 'other')")
    private String category;

    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL)
    private Set<TagPlan> tagPlans;
}