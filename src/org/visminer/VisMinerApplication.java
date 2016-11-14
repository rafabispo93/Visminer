package org.visminer;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.server.ResourceConfig;
import org.repositoryminer.persistence.Connection;

@ApplicationPath("rest")
public class VisMinerApplication extends ResourceConfig{

	public VisMinerApplication() {
		packages("org.visminer.controller");
		
		Connection conn = Connection.getInstance();
		conn.connect("mongodb://localhost", "visminer");
	}
	
}