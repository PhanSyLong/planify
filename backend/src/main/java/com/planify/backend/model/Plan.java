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
@Table(name="plan")
public class Plan {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
     Integer id;

    @Column(nullable = false, unique = true,  length = 120)
     String title;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    User owner;

    String description;

    @Column(nullable = false, columnDefinition = "ENUM('private', 'public')")
    String visibility;

    @Column(nullable = false, columnDefinition = "ENUM('incompleted', 'completed', 'cancelled')")
    String status;

    @Column(nullable = false)
    int duration;

    String picture;
}
