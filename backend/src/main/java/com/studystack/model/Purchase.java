package com.studystack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchases")
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "payment_id", nullable = false, unique = true)
    private String paymentId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "order_id", nullable = false, unique = true)
    private String orderId;

    @NotNull
    @Column(name = "purchase_date", nullable = false)
    private LocalDateTime purchaseDate;

    // Link to Order entity for referential integrity. Kept optional to preserve existing flow.
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "order_fk")
    private Order order;

    @Version
    private Integer version;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Purchase() {
    }

    public Purchase(Long id,
                    String paymentId,
                    String orderId,
                    LocalDateTime purchaseDate) {

        this.id = id;
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.purchaseDate = purchaseDate;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Integer getVersion() {
        return version;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}