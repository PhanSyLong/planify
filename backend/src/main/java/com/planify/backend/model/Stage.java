package com.planify.backend.model;

import jakarta.persistence.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name="stage")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    Plan plan_id;

    @Column(nullable = false, length = 120)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    int duration;

    @CreatedDate
    LocalDateTime created_date;

    @LastModifiedDate
    LocalDateTime updated_date;

    @Column(name="started_at")
    LocalDateTime started_at;

    @Column(name="completed_at")
    LocalDateTime completed_at;


}
