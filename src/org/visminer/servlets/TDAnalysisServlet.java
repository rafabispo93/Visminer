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

import org.bson.Document;
import org.json.JSONArray;
import org.repositoryminer.persistence.handler.TDAnalysisDocumentHandler;


/**
 * Servlet implementation class TDAnalysisServlet
 */
@WebServlet("/TDAnalysisServlet")
public class TDAnalysisServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	//private TDAnalysisDocumentHandler TDAnalysis = new TDAnalysisDocumentHandler();
	
	private PrintWriter out;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TDAnalysisServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		out = response.getWriter();				
		String action = request.getParameter("action");
	}
	/*
	private void getAllByTree(String treeId) {
		List<String> TDAnalysisList = new ArrayList<>();
		TDAnalysisHandler.getAllByTree(treeId)
			.forEach(type->TDAnalysisList.add(type.toJson()));
		out.println(TDAnalysisList);
	}*/

}
