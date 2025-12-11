package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name="stage")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="plan_id")
    Plan plan_id;

    @Column(nullable = false, unique = true,  length = 120)
    String title;

    @Column(nullable = false)
    String description;

    @Column(nullable = false)
    Integer duration;

    @CreatedDate
    LocalDateTime created_at;
}
