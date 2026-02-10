package com.planify.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter

@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "subtask")
public class Subtask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    @JsonIgnore
    Task task_id;

    @Column(nullable = false, unique = true,  length = 120)
    String title;

    @Column(nullable = false)
    String description;

    @Column(nullable = false)
    int duration;

    @Column(nullable = false, columnDefinition = "ENUM('incompleted', 'completed', 'cancelled')")
    String status;

    // New: optional scheduled date used for daily todo lists
    @Column(name = "scheduled_date")
    LocalDateTime scheduledDate;

    @Column(name = "scheduled_sent")
    boolean scheduledSent;

    @Column(name="started_at")
    LocalDateTime started_at;

    @Column(name="completed_at")
    LocalDateTime completed_at;


}
