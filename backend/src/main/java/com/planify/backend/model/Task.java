package com.planify.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Getter
@Setter

@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id")
    @JsonIgnore
    Stage stage_id;

    @Column(nullable = false)
    String description;

    @Column(nullable = false)
    int duration;

    @Column(name="started_at")
    LocalDateTime started_at;

    @Column(name="completed_at")
    LocalDateTime completed_at;
}
