package com.stackroute.keepnote.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

//import com.stackroute.keepnote.exception.UserIdAndPasswordMismatchException;
//import com.stackroute.keepnote.exception.UserNullException;
import com.stackroute.keepnote.exceptions.UserAlreadyExistsException;
import com.stackroute.keepnote.exceptions.UserNotFoundException;
//import com.stackroute.keepnote.jwt.SecurityTokenGenrator;
import com.stackroute.keepnote.model.User;
import com.stackroute.keepnote.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/*
 * As in this assignment, we are working on creating RESTful web service, hence annotate
 * the class with @RestController annotation. A class annotated with the @Controller annotation
 * has handler methods which return a view. However, if we use @ResponseBody annotation along
 * with @Controller annotation, it will return the data directly in a serialized 
 * format. Starting from Spring 4 and above, we can use @RestController annotation which 
 * is equivalent to using @Controller and @ResposeBody annotation
 */

@RestController
@RequestMapping("/user-service/api/v1/user")
@Api(tags = "UserController")
@CrossOrigin(origins = "*")
public class UserController {
	private Log log = LogFactory.getLog(getClass());

	/*
	 * Autowiring should be implemented for the UserService. (Use
	 * Constructor-based autowiring) Please note that we should not create an
	 * object using the new keyword
	 */
	private UserService userService;

	@Autowired
	public UserController(UserService userService) {
		this.userService = userService;
	}

	@RequestMapping(method = RequestMethod.GET)
	public String swaggerUi() {
		return "redirect:/swagger-ui.html";
	}

	/*
	 * Define a handler method which will create a specific user by reading the
	 * Serialized object from request body and save the user details in the
	 * database. This handler method should return any one of the status
	 * messages basis on different situations: 1. 201(CREATED) - If the user
	 * created successfully. 2. 409(CONFLICT) - If the userId conflicts with any
	 * existing user
	 * 
	 * This handler method should map to the URL "/user" using HTTP POST method
	 */
	@ApiOperation(value = "Register User")
	@PostMapping()
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		log.info("registerUser : STARTED ");
		HttpHeaders headers = new HttpHeaders();
		
		try {			
			userService.registerUser(user);
			return new ResponseEntity<>(user, headers, HttpStatus.CREATED);
		} catch (UserAlreadyExistsException e) {
			e.printStackTrace();
			return new ResponseEntity<>(headers, HttpStatus.CONFLICT);
		}
//		log.info("registerUser : ENDED ");
//		return new ResponseEntity<>(headers, HttpStatus.CONFLICT);
	}

	/*
	 * Define a handler method which will update a specific user by reading the
	 * Serialized object from request body and save the updated user details in
	 * a database. This handler method should return any one of the status
	 * messages basis on different situations: 1. 200(OK) - If the user updated
	 * successfully. 2. 404(NOT FOUND) - If the user with specified userId is
	 * not found.
	 * 
	 * This handler method should map to the URL "/api/v1/user/{id}" using HTTP
	 * PUT method.
	 */
	@ApiOperation(value = "Update User")
	@PutMapping("/{userId}")
	public ResponseEntity updateUser(@PathVariable() String userId, @RequestBody User user) {
		log.info("updateUser : STARTED ");
		HttpHeaders headers = new HttpHeaders();

		try {
			User fetchedUser = userService.updateUser(userId, user);
			log.info("updateUser : ENDED ");
			return new ResponseEntity<>(fetchedUser, headers, HttpStatus.OK);
		} catch (UserNotFoundException exception) {
			exception.printStackTrace();
			return new ResponseEntity<>(headers, HttpStatus.NOT_FOUND);
		}
	}

	/*
	 * Define a handler method which will delete a user from a database. This
	 * handler method should return any one of the status messages basis on
	 * different situations: 1. 200(OK) - If the user deleted successfully from
	 * database. 2. 404(NOT FOUND) - If the user with specified userId is not
	 * found.
	 *
	 * This handler method should map to the URL "/api/v1/user/{id}" using HTTP
	 * Delete method" where "id" should be replaced by a valid userId without {}
	 */
	@ApiOperation(value = "Delete User")
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable() String id) {
		log.info("deleteUser : STARTED ");
		HttpHeaders headers = new HttpHeaders();
		ResponseEntity responseEntity = null;

		try {
			userService.deleteUser(id);
			log.info("deleteUser : ENDED ");
			return new ResponseEntity<>(headers, HttpStatus.OK);
		} catch (UserNotFoundException exception) {
			exception.printStackTrace();
			return new ResponseEntity<>(headers, HttpStatus.NOT_FOUND);
		}
	}

	/*
	 * Define a handler method which will show details of a specific user. This
	 * handler method should return any one of the status messages basis on
	 * different situations: 1. 200(OK) - If the user found successfully. 2.
	 * 404(NOT FOUND) - If the user with specified userId is not found. This
	 * handler method should map to the URL "/api/v1/user/{id}" using HTTP GET
	 * method where "id" should be replaced by a valid userId without {}
	 */
	@ApiOperation(value = "Get User")
	@GetMapping("/{id}")
	public ResponseEntity<?> getUserById(@PathVariable() String id) {
		log.info("getUserById : STARTED");
		HttpHeaders headers = new HttpHeaders();
		ResponseEntity responseEntity = null;
		try {
			User fetchedUser = userService.getUserById(id);
			responseEntity = new ResponseEntity(fetchedUser, headers, HttpStatus.OK);

		} catch (UserNotFoundException e) {
			responseEntity = new ResponseEntity<>("User Not Found " + e.getMessage() + " ", HttpStatus.NOT_FOUND);
		}

		return responseEntity;
	}
	
	@ApiOperation(value = "Login User")
	@PostMapping("/login")
	public ResponseEntity loginUser(@RequestBody User loginUserDetails) {
		log.info("loginUser : STARTED");
		HttpHeaders headers = new HttpHeaders();
		ResponseEntity responseEntity = null;

		try {
			
			String userId = loginUserDetails.getUserId();
			String userName = loginUserDetails.getUserName();
			String password = loginUserDetails.getUserPassword();
			boolean validationFailed = false;

			if (userName == null || password == null) {
				responseEntity =  new ResponseEntity<>("User credentials cannot be empty  ", headers, HttpStatus.NOT_FOUND);
			}

			User user = getUserByName(userId);

			if (user == null) {
				responseEntity = new ResponseEntity<>("{}", headers, HttpStatus.NOT_FOUND);
			}

			String fetchedPassword = user.getUserPassword();
			if (!password.equals(fetchedPassword)) {
				validationFailed = true;
				responseEntity = new ResponseEntity<>("{}", headers, HttpStatus.NOT_FOUND);
			}
			
			if(!validationFailed) {
				responseEntity = new ResponseEntity(user, headers, HttpStatus.OK);
			}
			

		} catch (Exception exception) {
			responseEntity = new ResponseEntity<>("{}", headers, HttpStatus.UNAUTHORIZED);
		}
		
		return responseEntity;
	}
	
	private User getUserByName(String id) {
		log.info("getUserByName : STARTED");
		try {
			return userService.getUserById(id);	
		} catch (UserNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}
	
}
