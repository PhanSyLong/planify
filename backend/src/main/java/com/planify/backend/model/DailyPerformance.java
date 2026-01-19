package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "daily_performance")
public class DailyPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    Plan plan;

    @Column(name = "date", nullable = false)
    LocalDateTime date;

    @Column(name = "subtasks_completed")
    Integer subtasksCompleted;

    @Column(name = "subtasks_incompleted")
    Integer subtasksIncompleted;

    @Column(name = "subtasks_cancelled")
    Integer subtasksCancelled;

    @Column(name = "task_early")
    Integer taskEarly;

    @Column(name = "task_late")
    Integer taskLate;

    @Column(name = "task_ontime")
    Integer taskOntime;

    @Column(name = "duration_changes")
    Integer durationChanges;
}

