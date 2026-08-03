package com.studystack.dto;

public class RazorpayResponse {
	String razorpayPaymentId;
	String razorpayOrderId;
	String razorpaySignature;
	
	public String getRazorpayPaymentId() {
		return razorpayPaymentId;
	}
	
	public void setRazorpayPaymentId(String razorpayPaymentId) {
		this.razorpayPaymentId = razorpayPaymentId;
	}
	
	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}
	
	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}
	
	public String getRazorpaySignature() {
		return razorpaySignature;
	}
	
	public void setRazorpaySignature(String razorpaySignature) {
		this.razorpaySignature = razorpaySignature;
	}
	
}
