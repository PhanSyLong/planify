package com.planify.backend.mapper;

import com.planify.backend.dto.response.NotificationResponse;
import com.planify.backend.model.Notification;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-18T15:05:56+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public NotificationResponse toResponse(Notification notification) {
        if ( notification == null ) {
            return null;
        }

        NotificationResponse.NotificationResponseBuilder notificationResponse = NotificationResponse.builder();

        notificationResponse.recipientId( notificationRecipientId( notification ) );
        notificationResponse.planId( notificationPlanId( notification ) );
        notificationResponse.title( notificationPlanTitle( notification ) );
        notificationResponse.id( notification.getId() );
        notificationResponse.type( notification.getType() );
        notificationResponse.messageText( notification.getMessageText() );

        return notificationResponse.build();
    }

    @Override
    public List<NotificationResponse> toResponseList(List<Notification> notifications) {
        if ( notifications == null ) {
            return null;
        }

        List<NotificationResponse> list = new ArrayList<NotificationResponse>( notifications.size() );
        for ( Notification notification : notifications ) {
            list.add( toResponse( notification ) );
        }

        return list;
    }

    private Integer notificationRecipientId(Notification notification) {
        if ( notification == null ) {
            return null;
        }
        User recipient = notification.getRecipient();
        if ( recipient == null ) {
            return null;
        }
        Integer id = recipient.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Integer notificationPlanId(Notification notification) {
        if ( notification == null ) {
            return null;
        }
        Plan plan = notification.getPlan();
        if ( plan == null ) {
            return null;
        }
        Integer id = plan.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String notificationPlanTitle(Notification notification) {
        if ( notification == null ) {
            return null;
        }
        Plan plan = notification.getPlan();
        if ( plan == null ) {
            return null;
        }
        String title = plan.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }
}
