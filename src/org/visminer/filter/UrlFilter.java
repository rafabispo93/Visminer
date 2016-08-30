package org.visminer.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class UrlFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;		
		String url = req.getRequestURI();
		
		if (url.endsWith("technicaldebt/evolution")) {
			resp.sendRedirect(url.replace("technicaldebt/evolution", "#technicaldebt/evolution"));
		}
		else if (url.endsWith("technicaldebt/analyzer")) {
			resp.sendRedirect(url.replace("technicaldebt/analyzer", "#technicaldebt/analyzer"));
		}
		else if (url.endsWith("technicaldebt/management")) {
			resp.sendRedirect(url.replace("technicaldebt/management", "#technicaldebt/management"));
		}
		else if (url.endsWith("technicaldebt/committers")) {
			resp.sendRedirect(url.replace("technicaldebt/committers", "#technicaldebt/committers"));
		} else {
			chain.doFilter(request, response);	
		}
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}

}
