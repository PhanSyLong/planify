package com.planify.backend.mapper;

import com.planify.backend.dto.request.PlanRequest;
import com.planify.backend.dto.response.PlanResponse;
import com.planify.backend.model.Plan;
import com.planify.backend.model.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-18T02:26:17+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class PlanMapperImpl implements PlanMapper {

    @Override
    public PlanRequest toRequest(Plan plan) {
        if ( plan == null ) {
            return null;
        }

        PlanRequest planRequest = new PlanRequest();

        planRequest.setTitle( plan.getTitle() );
        planRequest.setDescription( plan.getDescription() );
        planRequest.setVisibility( plan.getVisibility() );
        planRequest.setStatus( plan.getStatus() );
        if ( plan.getDuration() != null ) {
            planRequest.setDuration( plan.getDuration() );
        }
        planRequest.setPicture( plan.getPicture() );
        planRequest.setReminderAt( plan.getReminderAt() );
        planRequest.setExpiredAt( plan.getExpiredAt() );

        return planRequest;
    }

    @Override
    public PlanResponse toResponse(Plan plan) {
        if ( plan == null ) {
            return null;
        }

        PlanResponse.PlanResponseBuilder planResponse = PlanResponse.builder();

        planResponse.ownerId( planOwnerId( plan ) );
        planResponse.createdAt( plan.getCreatedAt() );
        planResponse.updatedAt( plan.getUpdatedAt() );
        planResponse.id( plan.getId() );
        planResponse.title( plan.getTitle() );
        planResponse.description( plan.getDescription() );
        planResponse.visibility( plan.getVisibility() );
        planResponse.status( plan.getStatus() );
        if ( plan.getDuration() != null ) {
            planResponse.duration( plan.getDuration().intValue() );
        }
        planResponse.picture( plan.getPicture() );

        return planResponse.build();
    }

    @Override
    public List<PlanResponse> toResponseList(List<Plan> plans) {
        if ( plans == null ) {
            return null;
        }

        List<PlanResponse> list = new ArrayList<PlanResponse>( plans.size() );
        for ( Plan plan : plans ) {
            list.add( toResponse( plan ) );
        }

        return list;
    }

    @Override
    public void updatePlan(PlanRequest request, Plan targetPlan) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            targetPlan.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            targetPlan.setDescription( request.getDescription() );
        }
        if ( request.getVisibility() != null ) {
            targetPlan.setVisibility( request.getVisibility() );
        }
        if ( request.getStatus() != null ) {
            targetPlan.setStatus( request.getStatus() );
        }
        targetPlan.setDuration( request.getDuration() );
        if ( request.getPicture() != null ) {
            targetPlan.setPicture( request.getPicture() );
        }
        if ( request.getReminderAt() != null ) {
            targetPlan.setReminderAt( request.getReminderAt() );
        }
        if ( request.getExpiredAt() != null ) {
            targetPlan.setExpiredAt( request.getExpiredAt() );
        }
    }

    private Integer planOwnerId(Plan plan) {
        if ( plan == null ) {
            return null;
        }
        User owner = plan.getOwner();
        if ( owner == null ) {
            return null;
        }
        Integer id = owner.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
