package org.visminer.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.repositoryminer.persistence.handler.ReferenceDocumentHandler;

/**
 * Servlet implementation class ReferenceServlet
 */
@WebServlet("/ReferenceServlet")
public class ReferenceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private ReferenceDocumentHandler referenceHandler = new ReferenceDocumentHandler();
	private PrintWriter out;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReferenceServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
		
		switch (action) {
			case "getCustomTagsByRepository":
				getCustomTagsByRepository(request.getParameter("repositoryId"));				
				break;
			default:
				break;
		}
	}
	
	private void getCustomTagsByRepository(String repositoryId) {
		List<String> referenceList = new ArrayList<>();
		referenceHandler.getCustomTagsByRepository(repositoryId)
			.forEach(reference->referenceList.add(reference.toJson()));
		out.println(referenceList.toString());		
	}

}
