package org.visminer;

import javax.ws.rs.ApplicationPath;

import org.glassfish.jersey.server.ResourceConfig;

@ApplicationPath("rest")
public class VisMinerApplication extends ResourceConfig{

	public VisMinerApplication() {
		packages("org.visminer.controller");
	}
	
}