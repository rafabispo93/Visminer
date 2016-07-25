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

import org.json.JSONArray;
import org.repositoryminer.persistence.handler.TagAnalysisDocumentHandler;

/**
 * Servlet implementation class TagAnalysisServlet
 */
@WebServlet("/TagAnalysisServlet")
public class TagAnalysisServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private TagAnalysisDocumentHandler tagAnalysisHandler = new TagAnalysisDocumentHandler();
	private PrintWriter out;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TagAnalysisServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
		
		switch (action) {
			case "getAllByTag":
				getAllByTag(request.getParameter("tagName"));	
				break;
			case "getAllByTagsName":
				getAllByTagsName(request.getParameter("tagsName"));	
				break;
			default:
				break;
		}
	}

	private void getAllByTag(String tagName) {
		List<String> tagAnalysisList = new ArrayList<>();
		tagAnalysisHandler.getAllByTag(tagName)
			.forEach(type->tagAnalysisList.add(type.toJson()));
		out.println(tagAnalysisList);
	}
	
	private void getAllByTagsName(String tagsName) {
		JSONArray array = new JSONArray(tagsName);
		List<String> tagAnalysisList = new ArrayList<>();
		for (Object tagName : array) {	
			tagAnalysisHandler.getAllByTag(tagName.toString())
				.forEach(type->tagAnalysisList.add(type.toJson()));
		}
		out.println(tagAnalysisList);
	}

}
