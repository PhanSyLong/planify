package com.planify.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="tbl_notification")
public class Notification {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name="user_id")
    private User recipient;

    @Column(name="message_text")
    private String messageText;

    @Column(name="time", nullable = false)
    private LocalDateTime time;
}
