/*
 * Copyright 2025 Anton Tananaev (anton@traccar.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.traccar.api.resource;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.traccar.api.ExtendedObjectResource;
import org.traccar.model.Ad;
import org.traccar.storage.StorageException;
import org.traccar.storage.query.Columns;
import org.traccar.storage.query.Condition;
import org.traccar.storage.query.Order;
import org.traccar.storage.query.Request;

import java.util.Date;
import java.util.LinkedList;
import java.util.stream.Stream;

@Path("ads")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdsResource extends ExtendedObjectResource<Ad> {

    public AdsResource() {
        super(Ad.class, "createdAt");
    }

    @Override
    @POST
    public Response add(Ad entity) throws Exception {
        permissionsService.checkManager(getUserId());
        return super.add(entity);
    }

    @Override
    @Path("{id}")
    @PUT
    public Response update(Ad entity) throws Exception {
        permissionsService.checkManager(getUserId());
        return super.update(entity);
    }

    @Override
    @Path("{id}")
    @DELETE
    public Response remove(long id) throws Exception {
        permissionsService.checkManager(getUserId());
        return super.remove(id);
    }

    @GET
    @Path("public")
    @PermitAll
    public Stream<Ad> getPublic(
            @QueryParam("position") String position,
            @QueryParam("type") String type,
            @QueryParam("status") String status,
            @QueryParam("limit") Integer limit
    ) throws StorageException {

        var conditions = new LinkedList<Condition>();

        // Active ads only
        conditions.add(new Condition.Equals("isActive", true));

        // Start date in the past or today
        conditions.add(new Condition.Compare("startDate", "<=", new Date()));

        if (position != null && !position.isBlank()) {
            conditions.add(new Condition.Equals("position", position));
        }
        if (type != null && !type.isBlank()) {
            conditions.add(new Condition.Equals("type", type));
        }
        if (status != null && !status.isBlank()) {
            conditions.add(new Condition.Equals("status", status));
        }

        // Order by newest first; don't push LIMIT to SQL to allow post-filtering
        var stream = storage.getObjectsStream(Ad.class, new Request(
                new Columns.All(),
                Condition.merge(conditions),
                new Order("createdAt", true, 0)
        ));

        // Post-filter expired ads: endDate is null OR endDate >= now
        Date now = new Date();
        Stream<Ad> filtered = stream.filter(ad -> ad.getEndDate() == null || !ad.getEndDate().before(now));

        if (limit != null && limit > 0) {
            filtered = filtered.limit(limit);
        }

        return filtered;
    }
}
