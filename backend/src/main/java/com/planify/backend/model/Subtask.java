package com.planify.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "subtask")
public class Subtask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    Task task_id;

    @Column(nullable = false, unique = true,  length = 120)
    String title;

    @Column(nullable = false)
    String description;

    @Column(nullable = false)
    Integer duration;

    @Column(nullable = false, columnDefinition = "ENUM('incompleted', 'completed', 'cancelled')")
    String status;


}

