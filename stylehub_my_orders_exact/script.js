// StyleHub My Orders Engine - Exact UI Match, Real Backend Bridge & Detailed Order View
(function() {
  // Rich Demo Orders with complete items list, pricing, and live tracking metadata
  const DEMO_ORDERS = [
    {
      id: "SH128346",
      date: "12 Mar 2024",
      fullDate: "12 Mar 2024, 02:45 PM",
      status: "delivered",
      product: "Men’s Slim Fit Shirt",
      meta: "Size: L  |  Black  |  Qty: 1",
      price: "₹899",
      numericPrice: 899,
      image: "assets/orders/shirt.jpg",
      buttons: ["Buy Again", "Write a Review"],
      carrier: "BlueDart Express",
      awb: "BLD12834699IN",
      estDelivery: "Delivered on 14 Mar 2024",
      deliveryDate: "14 Mar 2024, 01:25 PM",
      paymentMethod: "UPI (Google Pay)",
      paymentStatus: "Paid",
      shippingAddress: {
        name: "Ritik Kumar",
        phone: "+91 98765 43210",
        address: "Flat 402, Royale Greens, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301"
      },
      items: [
        {
          id: "item_sh1",
          title: "Men’s Slim Fit Shirt",
          specs: "Size: L  |  Color: Black",
          size: "L",
          color: "Black",
          qty: 1,
          price: 899,
          originalPrice: 1299,
          image: "assets/orders/shirt.jpg"
        }
      ],
      pricing: {
        subtotal: 899,
        deliveryFee: 0,
        discount: 0,
        tax: "Included (GST 18%)",
        total: 899
      }
    },
    {
      id: "SH128112",
      date: "08 Mar 2024",
      fullDate: "08 Mar 2024, 11:15 AM",
      status: "delivered",
      product: "Men’s Regular Fit Jeans",
      meta: "Size: 32  |  Blue  |  Qty: 1",
      price: "₹1,299",
      numericPrice: 1299,
      image: "assets/orders/jeans.jpg",
      buttons: ["Buy Again", "Write a Review"],
      carrier: "Delhivery Logistics",
      awb: "DEL12811288IN",
      estDelivery: "Delivered on 11 Mar 2024",
      deliveryDate: "11 Mar 2024, 04:10 PM",
      paymentMethod: "Credit Card (•••• 8912)",
      paymentStatus: "Paid",
      shippingAddress: {
        name: "Ritik Kumar",
        phone: "+91 98765 43210",
        address: "Flat 402, Royale Greens, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301"
      },
      items: [
        {
          id: "item_sh2",
          title: "Men’s Regular Fit Jeans",
          specs: "Size: 32  |  Color: Denim Blue",
          size: "32",
          color: "Denim Blue",
          qty: 1,
          price: 1299,
          originalPrice: 1899,
          image: "assets/orders/jeans.jpg"
        }
      ],
      pricing: {
        subtotal: 1299,
        deliveryFee: 0,
        discount: 0,
        tax: "Included (GST 18%)",
        total: 1299
      }
    },
    {
      id: "SH127901",
      date: "02 Mar 2024",
      fullDate: "02 Mar 2024, 06:20 PM",
      status: "shipped",
      product: "Men’s Casual Sneakers",
      meta: "Size: 8  |  White  |  Qty: 1",
      price: "₹1,499",
      numericPrice: 1499,
      image: "assets/orders/sneakers.jpg",
      buttons: ["Track Order"],
      tracking: true,
      carrier: "BlueDart Express",
      awb: "BLD12790155IN",
      estDelivery: "Expected by 06 Mar 2024",
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending on Delivery",
      shippingAddress: {
        name: "Ritik Kumar",
        phone: "+91 98765 43210",
        address: "Flat 402, Royale Greens, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301"
      },
      items: [
        {
          id: "item_sh3",
          title: "Men’s Casual Sneakers",
          specs: "Size: UK 8  |  Color: Cloud White",
          size: "8",
          color: "Cloud White",
          qty: 1,
          price: 1499,
          originalPrice: 2199,
          image: "assets/orders/sneakers.jpg"
        }
      ],
      pricing: {
        subtotal: 1499,
        deliveryFee: 0,
        discount: 0,
        tax: "Included (GST 18%)",
        total: 1499
      }
    },
    {
      id: "SH127650",
      date: "25 Feb 2024",
      fullDate: "25 Feb 2024, 09:30 AM",
      status: "processing",
      product: "Men’s Hoodie",
      meta: "Size: L  |  Grey  |  Qty: 1",
      price: "₹1,199",
      numericPrice: 1199,
      image: "assets/orders/hoodie.jpg",
      buttons: [],
      carrier: "Shadowfax Express",
      awb: "SFX12765033IN",
      estDelivery: "Expected by 01 Mar 2024",
      paymentMethod: "UPI (PhonePe)",
      paymentStatus: "Paid",
      shippingAddress: {
        name: "Ritik Kumar",
        phone: "+91 98765 43210",
        address: "Flat 402, Royale Greens, Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301"
      },
      items: [
        {
          id: "item_sh4",
          title: "Men’s Casual Fleece Hoodie",
          specs: "Size: L  |  Color: Heather Grey",
          size: "L",
          color: "Heather Grey",
          qty: 1,
          price: 1199,
          originalPrice: 1699,
          image: "assets/orders/hoodie.jpg"
        }
      ],
      pricing: {
        subtotal: 1199,
        deliveryFee: 0,
        discount: 0,
        tax: "Included (GST 18%)",
        total: 1199
      }
    }
  ];

  const urlParams = new URLSearchParams(window.location.search);
  let filter = urlParams.get('filter') || "all";
  let activeOrders = [...DEMO_ORDERS];

  const ordersEl = document.getElementById("orders");
  const emptyEl = document.getElementById("empty");
  const toastEl = document.getElementById("toast");
  const overlayEl = document.getElementById("overlay");
  const modalBodyEl = document.getElementById("modalBody");
  const modalCloseEl = document.getElementById("modalClose");

  const orderDetailOverlay = document.getElementById("orderDetailOverlay");
  const orderDetailModal = document.getElementById("orderDetailModal");
  const invoiceOverlay = document.getElementById("invoiceOverlay");
  const invoiceModal = document.getElementById("invoiceModal");

  function statusLabel(s) {
    if (!s) return 'Processing';
    return s[0].toUpperCase() + s.slice(1);
  }

  // Fallback image helper
  function cleanImg(src) {
    if (!src) return "assets/orders/shirt.jpg";
    return src;
  }

  // Render individual order card in the list
  function card(o) {
    const actions = (o.buttons || []).map(b => 
      `<button class="action ${b === "Write a Review" ? "dark" : ""}" data-action="${b}" data-id="${o.id}" data-title="${encodeURIComponent(o.product)}" data-price="${encodeURIComponent(o.price)}" data-img="${encodeURIComponent(o.image)}">${b}</button>`
    ).join("");

    const itemsCount = o.items ? o.items.length : 1;
    const multiItemBadge = itemsCount > 1 ? `<span style="font-size:11px; background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:600; margin-left:6px;">+${itemsCount - 1} more item${itemsCount > 2 ? 's' : ''}</span>` : '';

    return `
    <article class="card" data-status="${o.status}" data-id="${o.id}" title="Click to view detailed order status, products, and tracking">
      <div class="card-main">
        <img class="product-image" src="${cleanImg(o.image)}" alt="${o.product}" onerror="this.src='assets/orders/shirt.jpg'">
        <div class="product-info">
          <h2>${o.product} ${multiItemBadge}</h2>
          <div class="meta">${o.meta}</div>
          <div class="price">${o.price}</div>
          <div class="card-tap-hint" data-action="View Details" data-id="${o.id}">
            <span>👁</span> View Order Details & Tracking &rarr;
          </div>
        </div>
        <div class="order-side">
          <div class="order-id">Order #${o.id}</div>
          <div class="order-date">${o.date}</div>
          <span class="status ${o.status}">${statusLabel(o.status)}</span>
        </div>
        <div class="chevron" title="Click to view full order details">›</div>
        ${actions ? `<div class="card-actions">${actions}</div>` : ""}
      </div>
    </article>`;
  }

  // Generate dynamic 5-milestone tracking timeline
  function getTrackingSteps(o) {
    const status = (o.status || 'processing').toLowerCase();
    const dateStr = o.date || "Recently";

    if (status === 'delivered') {
      return [
        {
          title: "Order Placed & Confirmed",
          time: `${dateStr}, 10:30 AM`,
          desc: "Payment verified. Order sent to StyleHub fulfillment center.",
          loc: "StyleHub Web Hub",
          state: "done"
        },
        {
          title: "Packed & Quality Inspected",
          time: `${dateStr}, 03:45 PM`,
          desc: "Item verified by Quality Check team and packaged in secure StyleHub box.",
          loc: "Central Warehouse, Bhiwandi",
          state: "done"
        },
        {
          title: "Dispatched & In Transit",
          time: `${dateStr}, 08:20 PM`,
          desc: `Handed over to ${o.carrier || 'BlueDart Express'}. In transit between regional hubs.`,
          loc: "Regional Sorting Facility Hub",
          state: "done"
        },
        {
          title: "Out for Delivery",
          time: o.deliveryDate ? o.deliveryDate.replace(', ', ' &bull; ') : "Delivery Day &bull; 08:30 AM",
          desc: "Courier delivery associate has picked up package for doorstep drop.",
          loc: `${o.shippingAddress?.city || 'Local'} Delivery Center`,
          state: "done"
        },
        {
          title: "Delivered to Customer",
          time: o.deliveryDate || "14 Mar 2024, 01:25 PM",
          desc: `Package delivered safely. Confirmed by ${o.shippingAddress?.name || 'Customer'}.`,
          loc: "Doorstep Delivery Confirmed",
          state: "done"
        }
      ];
    } else if (status === 'shipped') {
      return [
        {
          title: "Order Placed & Confirmed",
          time: `${dateStr}, 11:15 AM`,
          desc: "Payment verified and order approved.",
          loc: "StyleHub Web Hub",
          state: "done"
        },
        {
          title: "Packed & Handed to Courier",
          time: `${dateStr}, 05:00 PM`,
          desc: `Package sealed and picked up by ${o.carrier || 'BlueDart Express'}.`,
          loc: "Central Warehouse, Bhiwandi",
          state: "done"
        },
        {
          title: "In Transit to Destination Hub",
          time: "Yesterday, 10:45 PM",
          desc: `Package departed origin facility. In transit to ${o.shippingAddress?.city || 'Delhi'} Sorting Hub.`,
          loc: "Transit Sorting Hub &bull; On the way",
          state: "active"
        },
        {
          title: "Out for Delivery",
          time: o.estDelivery || "Expected in 1-2 days",
          desc: "Will be assigned to local delivery partner upon hub arrival.",
          loc: `${o.shippingAddress?.city || 'Local'} Delivery Center`,
          state: "pending"
        },
        {
          title: "Delivered",
          time: o.estDelivery || "Pending",
          desc: "Doorstep delivery with OTP verification.",
          loc: "Destination Address",
          state: "pending"
        }
      ];
    } else if (status === 'cancelled') {
      return [
        {
          title: "Order Placed",
          time: `${dateStr}, 10:00 AM`,
          desc: "Order created by customer.",
          loc: "StyleHub Web Hub",
          state: "done"
        },
        {
          title: "Order Cancelled",
          time: `${dateStr}, 11:30 AM`,
          desc: "Order was cancelled upon user request.",
          loc: "StyleHub Customer Support",
          state: "cancelled-step"
        },
        {
          title: "Refund Processed",
          time: `${dateStr}, 02:00 PM`,
          desc: "100% refund credited back to original payment source.",
          loc: "Payment Gateway",
          state: "done"
        }
      ];
    } else {
      // Processing
      return [
        {
          title: "Order Placed & Confirmed",
          time: `${dateStr}, 09:30 AM`,
          desc: "Your order is confirmed. Payment verified.",
          loc: "StyleHub Online",
          state: "done"
        },
        {
          title: "Packing in Progress",
          time: "In Progress",
          desc: "Warehouse team is preparing items for dispatch within 24 hours.",
          loc: "Fulfillment Hub, Bhiwandi",
          state: "active"
        },
        {
          title: "Handover to Courier",
          time: "Scheduled for Today",
          desc: `Courier ${o.carrier || 'Shadowfax Express'} assigned.`,
          loc: "Origin Hub",
          state: "pending"
        },
        {
          title: "In Transit",
          time: "Upcoming",
          desc: "Will be transported to your city hub.",
          loc: "Inter-city route",
          state: "pending"
        },
        {
          title: "Delivered",
          time: o.estDelivery || "Expected in 3-4 days",
          desc: "Doorstep delivery.",
          loc: "Destination Address",
          state: "pending"
        }
      ];
    }
  }

  // Open the Full Detailed Order View
  function showOrderDetail(orderId) {
    if (!orderId) return;
    const o = activeOrders.find(x => String(x.id) === String(orderId)) || {
      id: orderId,
      product: "StyleHub Apparel",
      price: "₹899",
      numericPrice: 899,
      status: "processing",
      date: "Recently",
      image: "assets/orders/shirt.jpg"
    };

    const status = (o.status || 'processing').toLowerCase();
    const carrier = o.carrier || "BlueDart Express";
    const awb = o.awb || ("BLD" + String(o.id).replace(/\D/g, '') + "99IN");
    const fullDate = o.fullDate || `${o.date || 'Recently'}, 02:30 PM`;
    const items = (o.items && o.items.length > 0) ? o.items : [
      {
        id: "p_" + o.id,
        title: o.product || "StyleHub Premium Apparel",
        specs: o.meta || "Size: L  |  Color: Standard  |  Qty: 1",
        size: "L",
        color: "Standard",
        qty: 1,
        price: o.numericPrice || 899,
        originalPrice: Math.round((o.numericPrice || 899) * 1.3),
        image: cleanImg(o.image)
      }
    ];

    const addr = o.shippingAddress || {
      name: "Ritik Kumar",
      phone: "+91 98765 43210",
      address: "Flat 402, Royale Greens, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301"
    };

    // Calculate subtotal
    const subtotal = items.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.qty) || 1)), 0);
    const deliveryFee = 0;
    const discount = o.pricing?.discount || 0;
    const finalTotal = o.pricing?.total || (subtotal - discount + deliveryFee);
    const paymentMethod = o.paymentMethod || "UPI (Google Pay)";
    const paymentStatus = o.paymentStatus || (status === 'processing' ? 'Paid' : (paymentMethod.includes('Cash') ? 'Pay on Delivery' : 'Paid'));

    // Status Banner Content
    let bannerTitle = "Order Processing";
    let bannerDesc = "We have received your order and are preparing it for shipment.";
    let bannerIcon = "⏳";
    if (status === 'delivered') {
      bannerTitle = "Order Delivered Successfully";
      bannerDesc = o.deliveryDate ? `Package arrived on ${o.deliveryDate}. Thank you for shopping with StyleHub!` : "Your package has been delivered to your doorstep.";
      bannerIcon = "✓";
    } else if (status === 'shipped') {
      bannerTitle = "Order In Transit";
      bannerDesc = o.estDelivery ? `${o.estDelivery}. Courier is on schedule.` : "Package is on the way to your delivery hub.";
      bannerIcon = "🚚";
    } else if (status === 'cancelled') {
      bannerTitle = "Order Cancelled";
      bannerDesc = "This order was cancelled. Full refund was credited to your original payment method.";
      bannerIcon = "✕";
    }

    // Generate Stepper HTML
    const steps = getTrackingSteps(o);
    const stepperHtml = steps.map(st => {
      let icon = "○";
      if (st.state === "done") icon = "✓";
      else if (st.state === "active") icon = "•";
      else if (st.state === "cancelled-step") icon = "✕";

      return `
        <div class="timeline-step ${st.state}">
          <span class="timeline-dot">${icon}</span>
          <div class="timeline-content">
            <div class="timeline-content-header">
              <span class="timeline-step-title">${st.title}</span>
              <span class="timeline-step-time">${st.time}</span>
            </div>
            <div class="timeline-step-desc">${st.desc}</div>
            <div class="timeline-step-loc">📍 ${st.loc}</div>
          </div>
        </div>
      `;
    }).join("");

    // Generate Items HTML
    const itemsHtml = items.map(it => {
      const itPrice = Number(it.price) || 899;
      const itQty = Number(it.qty) || 1;
      const itTotal = itPrice * itQty;
      const origPrice = it.originalPrice || Math.round(itPrice * 1.3);

      return `
        <div class="detail-item-row">
          <img class="detail-item-img" src="${cleanImg(it.image)}" alt="${it.title}" onerror="this.src='assets/orders/shirt.jpg'">
          <div class="detail-item-info">
            <div class="detail-item-name">${it.title}</div>
            <div class="detail-item-meta">${it.specs || `Size: ${it.size || 'L'} &bull; Qty: ${itQty}`}</div>
            <div class="detail-item-price-unit">
              ₹${itPrice.toLocaleString('en-IN')} each &times; ${itQty}
              ${origPrice > itPrice ? `<span style="text-decoration:line-through; color:#94a3b8; font-size:12px; margin-left:6px;">₹${(origPrice * itQty).toLocaleString('en-IN')}</span>` : ''}
            </div>
          </div>
          <div class="detail-item-right">
            <div class="detail-item-price-total">₹${itTotal.toLocaleString('en-IN')}</div>
            <div class="detail-item-actions">
              <button class="detail-sub-btn" data-action="Buy Again" data-title="${encodeURIComponent(it.title)}" data-price="${itPrice}" data-img="${encodeURIComponent(it.image)}">Buy Again</button>
              ${status === 'delivered' ? `<button class="detail-sub-btn" data-action="Write a Review" data-id="${o.id}" data-title="${encodeURIComponent(it.title)}">Review</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Modal Complete Content
    const modalContent = `
      <div class="detail-modal-header">
        <div class="detail-modal-header-left">
          <button class="detail-back-btn" id="closeDetailBackBtn" title="Back to Orders">&larr;</button>
          <div class="detail-modal-title-wrap">
            <h2>Order Details</h2>
            <div class="detail-order-submeta">
              <span class="detail-order-id-badge">#${o.id}</span>
              <span>&bull;</span>
              <span>Placed on ${fullDate}</span>
              <span>&bull;</span>
              <span class="status ${status}">${statusLabel(status)}</span>
            </div>
          </div>
        </div>
        <button class="detail-close-btn" id="closeDetailXBtn" title="Close details">&times;</button>
      </div>

      <div class="detail-modal-body">
        <!-- Status Banner -->
        <div class="status-banner ${status}">
          <div class="status-banner-icon">${bannerIcon}</div>
          <div class="status-banner-text">
            <h3>${bannerTitle}</h3>
            <p>${bannerDesc}</p>
          </div>
        </div>

        <!-- Shipping & Live Tracking Status Card -->
        <div class="detail-card">
          <div class="detail-card-head">
            <h4>🚚 Shipping & Delivery Tracking</h4>
            <span class="detail-card-head-extra">${statusLabel(status)}</span>
          </div>

          <div class="carrier-info-bar">
            <div class="carrier-info-left">
              <span class="carrier-badge">Express</span>
              <div>
                <div class="carrier-name">${carrier}</div>
                <div class="carrier-awb">AWB Tracking: <strong>${awb}</strong></div>
              </div>
            </div>
            <button class="awb-copy-btn" id="copyAwbBtn" data-awb="${awb}">
              📋 Copy Tracking #
            </button>
          </div>

          <!-- Interactive Vertical Stepper -->
          <div class="timeline-stepper">
            ${stepperHtml}
          </div>
        </div>

        <!-- Ordered Products List -->
        <div class="detail-card">
          <div class="detail-card-head">
            <h4>🛍 Items in this Order (${items.length})</h4>
            <span class="detail-card-head-extra">All items verified</span>
          </div>
          <div class="detail-items-list">
            ${itemsHtml}
          </div>
        </div>

        <!-- Pricing & Shipping Address Grid -->
        <div class="detail-grid-row">
          <!-- Price Summary Breakdown -->
          <div class="detail-card">
            <div class="detail-card-head">
              <h4>💳 Payment Summary</h4>
              <span class="detail-card-head-extra">${paymentStatus}</span>
            </div>
            <div class="price-table">
              <div class="price-row">
                <span>Items Subtotal (${items.length} item${items.length > 1 ? 's' : ''})</span>
                <span>₹${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="price-row">
                <span>Delivery Charges</span>
                <span style="color:#10b981; font-weight:600;">FREE</span>
              </div>
              ${discount > 0 ? `
              <div class="price-row discount-row">
                <span>Promotional Discount</span>
                <span>- ₹${discount.toLocaleString('en-IN')}</span>
              </div>` : ''}
              <div class="price-row">
                <span>Estimated Taxes (GST)</span>
                <span>Included</span>
              </div>
              <div class="price-row total-row">
                <span>Grand Total Paid</span>
                <span>₹${finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div class="payment-badge-row">
              <span>Payment: ${paymentMethod}</span>
              <span class="payment-status-pill">${paymentStatus}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="detail-card">
            <div class="detail-card-head">
              <h4>📍 Delivery Address</h4>
            </div>
            <div class="address-text-block">
              <div class="address-recipient-name">${addr.name || 'Customer'}</div>
              <div>${addr.address || 'Address on file'}</div>
              <div>${addr.city || 'City'}, ${addr.state || 'State'} - ${addr.pincode || '201301'}</div>
              <div class="address-phone-tag">
                <span>📞</span> ${addr.phone || '+91 98765 43210'}
              </div>
            </div>
          </div>
        </div>

        <!-- Help, Invoice & Assistance Row -->
        <div class="detail-action-links-row">
          <div class="detail-action-left">
            Need an official receipt or customer support?
          </div>
          <div class="detail-action-buttons">
            <button class="detail-secondary-btn" id="downloadInvoiceBtn" data-id="${o.id}">
              📄 Tax Invoice
            </button>
            <button class="detail-secondary-btn" id="needHelpBtn" data-id="${o.id}">
              💬 Need Help?
            </button>
          </div>
        </div>
      </div>

      <div class="detail-modal-footer">
        <button class="outline-btn" id="closeDetailFooterBtn">Close Details</button>
        <button class="filled-btn" id="buyAllAgainBtn" data-id="${o.id}">
          🛍 Buy Again (₹${finalTotal.toLocaleString('en-IN')})
        </button>
      </div>
    `;

    if (orderDetailModal) {
      orderDetailModal.innerHTML = modalContent;
    }
    if (orderDetailOverlay) {
      orderDetailOverlay.classList.remove("hidden");
    }

    // Update URL hash / query without reloading
    try {
      const url = new URL(window.location);
      url.searchParams.set('orderId', o.id);
      window.history.pushState({ orderId: o.id }, '', url);
    } catch(e) {}

    // Setup interactive handlers inside the detail modal
    setupDetailModalHandlers(o, items, finalTotal);
  }

  // Setup button handlers for the detailed modal
  function setupDetailModalHandlers(o, items, finalTotal) {
    // Back and Close buttons
    const closeBack = document.getElementById("closeDetailBackBtn");
    const closeX = document.getElementById("closeDetailXBtn");
    const closeFooter = document.getElementById("closeDetailFooterBtn");

    if (closeBack) closeBack.onclick = closeOrderDetail;
    if (closeX) closeX.onclick = closeOrderDetail;
    if (closeFooter) closeFooter.onclick = closeOrderDetail;

    // Copy Tracking #
    const copyBtn = document.getElementById("copyAwbBtn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        const awb = copyBtn.dataset.awb;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(awb).then(() => {
            copyBtn.innerHTML = "✓ Copied!";
            toast("Tracking AWB copied to clipboard: " + awb);
            setTimeout(() => { copyBtn.innerHTML = "📋 Copy Tracking #"; }, 2000);
          }).catch(() => {
            toast("Tracking AWB: " + awb);
          });
        } else {
          toast("Tracking AWB: " + awb);
        }
      };
    }

    // Tax Invoice Modal Trigger
    const invoiceBtn = document.getElementById("downloadInvoiceBtn");
    if (invoiceBtn) {
      invoiceBtn.onclick = () => showInvoiceModal(o);
    }

    // Need Help Modal
    const helpBtn = document.getElementById("needHelpBtn");
    if (helpBtn) {
      helpBtn.onclick = () => {
        openModal(
          `StyleHub Help Center — Order #${o.id}`,
          `
            <p style="margin-bottom:12px; color:#475569;">We're here 24/7 to help you with your order.</p>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:16px;">
              <div style="font-weight:700; color:#0f172a; margin-bottom:6px;">Returns & Exchanges</div>
              <p style="font-size:13px; color:#64748b; margin:0;">Eligible for 7-day hassle-free doorstep pickup & exchange. Tags must remain intact.</p>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:16px;">
              <div style="font-weight:700; color:#0f172a; margin-bottom:6px;">Support Contacts</div>
              <div style="font-size:13px; color:#334155;">📞 Phone: 1800-STYLE-HUB (Toll Free)</div>
              <div style="font-size:13px; color:#334155; margin-top:4px;">✉ Email: support@stylehub.store</div>
            </div>
            <button class="filled-btn" style="width:100%;" onclick="document.getElementById('overlay').classList.add('hidden')">Got it, thanks!</button>
          `
        );
      };
    }

    // Buy All Again button
    const buyAllBtn = document.getElementById("buyAllAgainBtn");
    if (buyAllBtn) {
      buyAllBtn.onclick = () => {
        items.forEach(it => {
          buyAgain(it.id, it.title, it.price, it.image);
        });
        toast("All order items added to cart!");
      };
    }

    // Per-item action buttons inside the detail view
    const itemActionBtns = orderDetailModal.querySelectorAll(".detail-sub-btn");
    itemActionBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === "Buy Again") {
          buyAgain(btn.dataset.id, btn.dataset.title, btn.dataset.price, btn.dataset.img);
        } else if (action === "Write a Review") {
          showReviewModal(btn.dataset.id || o.id, btn.dataset.title);
        }
      };
    });
  }

  // Close the detailed order view
  function closeOrderDetail() {
    if (orderDetailOverlay) {
      orderDetailOverlay.classList.add("hidden");
    }
    try {
      const url = new URL(window.location);
      url.searchParams.delete('orderId');
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url);
    } catch(e) {}
  }

  // Show Official StyleHub Tax Invoice
  function showInvoiceModal(o) {
    if (!invoiceModal || !invoiceOverlay) return;

    const items = (o.items && o.items.length > 0) ? o.items : [
      {
        title: o.product || "StyleHub Premium Apparel",
        specs: o.meta || "Size: L &bull; Qty: 1",
        qty: 1,
        price: o.numericPrice || 899
      }
    ];

    const subtotal = items.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.qty) || 1)), 0);
    const discount = o.pricing?.discount || 0;
    const finalTotal = o.pricing?.total || (subtotal - discount);
    const invoiceNumber = "INV-SH-" + String(o.id).replace(/\D/g, '') + "-2024";

    const rowsHtml = items.map((it, idx) => {
      const p = Number(it.price) || 899;
      const q = Number(it.qty) || 1;
      const t = p * q;
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${it.title}</strong><br><small style="color:#64748b;">${it.specs || 'Regular Variant'}</small></td>
          <td>${q}</td>
          <td>₹${p.toLocaleString('en-IN')}</td>
          <td>₹${t.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join("");

    invoiceModal.innerHTML = `
      <div class="invoice-header">
        <div>
          <div class="invoice-brand">STYLE<span>HUB</span></div>
          <p style="font-size:12px; color:#64748b; margin-top:4px;">StyleHub Retail India Pvt. Ltd.<br>GSTIN: 07AAACS1429B1Z8</p>
        </div>
        <div class="invoice-title">
          <h3>Tax Invoice / Receipt</h3>
          <p>Invoice #: <strong>${invoiceNumber}</strong><br>Order ID: <strong>#${o.id}</strong><br>Date: ${o.date || 'March 2024'}</p>
        </div>
      </div>

      <div class="invoice-grid">
        <div>
          <strong>Billed & Shipped To:</strong>
          <div style="margin-top:4px; color:#334155;">
            ${o.shippingAddress?.name || 'Customer'}<br>
            ${o.shippingAddress?.address || 'Delivery Address'}<br>
            ${o.shippingAddress?.city || 'City'}, ${o.shippingAddress?.state || 'State'} - ${o.shippingAddress?.pincode || '201301'}<br>
            Phone: ${o.shippingAddress?.phone || '+91 98765 43210'}
          </div>
        </div>
        <div style="text-align:right;">
          <strong>Order Details:</strong>
          <div style="margin-top:4px; color:#334155;">
            Payment Method: ${o.paymentMethod || 'UPI'}<br>
            Payment Status: Paid<br>
            Courier: ${o.carrier || 'BlueDart Express'}<br>
            AWB: ${o.awb || 'BLD9921IN'}
          </div>
        </div>
      </div>

      <table class="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="invoice-totals">
        <div><span>Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        <div><span>Delivery Fee:</span><span style="color:#10b981;">FREE</span></div>
        ${discount > 0 ? `<div><span>Discount:</span><span>- ₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div><span>Taxes (GST 18% included):</span><span>₹${Math.round(subtotal * 0.18).toLocaleString('en-IN')}</span></div>
        <div class="grand"><span>Grand Total:</span><span>₹${finalTotal.toLocaleString('en-IN')}</span></div>
      </div>

      <div class="invoice-footer-actions">
        <button class="outline-btn" id="closeInvoiceBtn">Close</button>
        <button class="filled-btn" id="printInvoiceBtn">🖨 Print / Save as PDF</button>
      </div>
    `;

    invoiceOverlay.classList.remove("hidden");

    document.getElementById("closeInvoiceBtn").onclick = () => invoiceOverlay.classList.add("hidden");
    document.getElementById("printInvoiceBtn").onclick = () => window.print();
  }

  // Close modals on backdrop click or escape
  if (orderDetailOverlay) {
    orderDetailOverlay.onclick = (e) => {
      if (e.target === orderDetailOverlay) {
        closeOrderDetail();
      }
    };
  }
  if (invoiceOverlay) {
    invoiceOverlay.onclick = (e) => {
      if (e.target === invoiceOverlay) {
        invoiceOverlay.classList.add("hidden");
      }
    };
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderDetail();
      if (invoiceOverlay) invoiceOverlay.classList.add("hidden");
      closeModal();
    }
  });

  window.addEventListener('popstate', () => {
    if (orderDetailOverlay && !orderDetailOverlay.classList.contains("hidden")) {
      closeOrderDetail();
    }
  });

  function render() {
    const list = filter === "all" ? activeOrders : activeOrders.filter(o => o.status === filter);
    if (ordersEl) {
      ordersEl.innerHTML = list.map(card).join("");
    }
    if (emptyEl) {
      emptyEl.classList.toggle("hidden", list.length > 0);
    }
  }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  function openModal(title, contentHtml) {
    if (!modalBodyEl || !overlayEl) return;
    modalBodyEl.innerHTML = `<h3>${title}</h3>${contentHtml}`;
    overlayEl.classList.remove("hidden");
  }

  function closeModal() {
    if (overlayEl) overlayEl.classList.add("hidden");
  }

  // Update Cart Count Badge from localStorage
  function updateCartBadge() {
    try {
      const u = JSON.parse(localStorage.getItem('xpord_user') || 'null');
      const cartKey = u?.uid ? `xpord_cart_${u.uid}` : 'xpord_cart';
      const items = JSON.parse(localStorage.getItem(cartKey) || localStorage.getItem('xpord_cart') || '[]');
      const count = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
      const cartNavBadge = document.querySelector(".cart-nav i");
      if (cartNavBadge) {
        cartNavBadge.textContent = count > 0 ? count : "0";
      }
    } catch(e) {}
  }

  // Add Item to Cart (for "Buy Again")
  function buyAgain(orderId, title, priceStr, img) {
    try {
      const u = JSON.parse(localStorage.getItem('xpord_user') || 'null');
      const cartKey = u?.uid ? `xpord_cart_${u.uid}` : 'xpord_cart';
      let items = [];
      try { items = JSON.parse(localStorage.getItem(cartKey) || '[]'); } catch(e) { items = []; }

      const numPrice = parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) || 899;
      const cleanTitle = title ? decodeURIComponent(title) : "StyleHub Apparel";
      const cleanImage = img ? decodeURIComponent(img) : "assets/orders/shirt.jpg";

      const existingIndex = items.findIndex(i => i.title === cleanTitle || i.id === orderId);
      if (existingIndex > -1) {
        items[existingIndex].quantity = (Number(items[existingIndex].quantity) || 1) + 1;
      } else {
        items.push({
          id: 'item_' + Date.now(),
          title: cleanTitle,
          price: numPrice,
          originalPrice: Math.round(numPrice * 1.3),
          quantity: 1,
          size: 'L',
          image: cleanImage,
          category: 'Men'
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(items));
      localStorage.setItem('xpord_cart', JSON.stringify(items));
      updateCartBadge();
      toast("Product added to cart!");
    } catch(e) {
      toast("Added to cart");
    }
  }

  // Open Tracking Details Modal (Quick modal fallback)
  function showTrackingModal(orderId) {
    showOrderDetail(orderId);
  }

  // Open Write Review Modal
  function showReviewModal(orderId, title) {
    const cleanTitle = title ? decodeURIComponent(title) : "StyleHub Apparel";
    const modalHtml = `
      <p style="color:#64748b; margin-bottom:8px;">Reviewing: <strong>${cleanTitle}</strong> (Order #${orderId})</p>
      
      <div style="font-size:13px; font-weight:600; color:#334155; margin-top:12px;">Your Rating</div>
      <div class="rating-stars" id="ratingStars">
        <span class="star selected" data-star="1">★</span>
        <span class="star selected" data-star="2">★</span>
        <span class="star selected" data-star="3">★</span>
        <span class="star selected" data-star="4">★</span>
        <span class="star selected" data-star="5">★</span>
      </div>

      <div style="font-size:13px; font-weight:600; color:#334155; margin-bottom:6px;">Your Comments</div>
      <textarea class="review-textarea" id="reviewComment" placeholder="How was the fit, comfort, and fabric quality?"></textarea>

      <button class="filled-btn" id="submitReviewBtn" style="width:100%;">Submit Review</button>
    `;
    openModal("Write a Review", modalHtml);

    // Star rating selection
    const stars = document.querySelectorAll("#ratingStars .star");
    let currentRating = 5;
    stars.forEach(s => {
      s.onclick = () => {
        currentRating = parseInt(s.dataset.star, 10);
        stars.forEach(st => {
          const val = parseInt(st.dataset.star, 10);
          st.classList.toggle("selected", val <= currentRating);
        });
      };
    });

    const submitBtn = document.getElementById("submitReviewBtn");
    if (submitBtn) {
      submitBtn.onclick = () => {
        closeModal();
        toast("Thank you! Your review has been submitted.");
      };
    }
  }

  // Setup tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      filter = tab.dataset.filter;
      render();
    });
  });

  // Check initial active tab
  if (filter && filter !== 'all') {
    const matchedTab = document.querySelector(`.tab[data-filter="${filter}"]`);
    if (matchedTab) {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      matchedTab.classList.add("active");
    }
  }

  // Action clicks inside order cards
  if (ordersEl) {
    ordersEl.addEventListener("click", e => {
      // 1. If an action button was clicked (Buy Again, Write a Review, Track Order, View Details), handle it
      const b = e.target.closest("[data-action]");
      if (b) {
        const action = b.dataset.action;
        const id = b.dataset.id;
        const title = b.dataset.title;
        const price = b.dataset.price;
        const img = b.dataset.img;

        if (action === "Buy Again") {
          buyAgain(id, title, price, img);
        } else if (action === "Write a Review") {
          showReviewModal(id, title);
        } else if (action === "Track Order" || action === "View Details") {
          showOrderDetail(id);
        }
        return;
      }

      // 2. Touching ANY order card opens the Detailed View!
      const cardEl = e.target.closest(".card");
      if (cardEl) {
        const id = cardEl.dataset.id;
        if (id) {
          showOrderDetail(id);
        }
      }
    });
  }

  // Modal close handlers
  if (modalCloseEl) modalCloseEl.onclick = closeModal;
  if (overlayEl) {
    overlayEl.onclick = e => {
      if (e.target.id === "overlay") closeModal();
    };
  }

  // Header and Empty action handlers
  function navigateTo(url) {
    if (window.styleHubGo) {
      window.styleHubGo(url);
    } else {
      window.location.href = url;
    }
  }

  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.onclick = () => {
      if (window.history.length > 1 && document.referrer) {
        window.history.back();
      } else {
        navigateTo("account.html");
      }
    };
  }

  const brandBtn = document.getElementById("brandBtn");
  if (brandBtn) {
    brandBtn.onclick = () => {
      navigateTo("index.html");
    };
  }

  const shopBtn = document.getElementById("shopBtn");
  if (shopBtn) {
    shopBtn.onclick = () => {
      navigateTo("category.html");
    };
  }

  // Bottom Nav Redirection
  document.querySelectorAll(".bottom-nav button").forEach(b => {
    b.onclick = () => {
      const page = b.dataset.page;
      if (page === "Home") navigateTo("index.html");
      else if (page === "Categories") navigateTo("category.html");
      else if (page === "Wishlist") navigateTo("index.html#wishlist");
      else if (page === "Cart") navigateTo("cart.html");
      else if (page === "Account") navigateTo("account.html");
    };
  });

  // Load user orders from Firestore / localStorage
  function loadUserOrders() {
    try {
      const rawUser = localStorage.getItem('xpord_user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const rawSaved = localStorage.getItem('xpord_orders');
      let customOrders = [];
      if (rawSaved) {
        try { customOrders = JSON.parse(rawSaved); } catch(e) {}
      }

      if (customOrders && customOrders.length > 0) {
        // Map stored orders into the UI structure
        const formatted = customOrders.map(o => {
          const firstItem = o.items?.[0] || o.cart?.[0] || {};
          const status = (o.status || 'processing').toLowerCase();
          const amt = o.total || o.totalAmount || firstItem.price || 999;
          const orderId = o.orderId || o.id || 'SH' + Math.floor(100000 + Math.random() * 900000);

          // Map items array
          const rawItems = (o.items && o.items.length > 0) ? o.items : [firstItem];
          const itemsList = rawItems.map((it, idx) => ({
            id: it.id || `it_${orderId}_${idx}`,
            title: it.title || it.name || "Men’s Premium Apparel",
            specs: `Size: ${it.size || 'L'}  |  Qty: ${it.quantity || 1}`,
            size: it.size || 'L',
            color: it.color || 'Standard',
            qty: Number(it.quantity) || 1,
            price: Number(it.price) || 899,
            originalPrice: Math.round((Number(it.price) || 899) * 1.3),
            image: it.image || it.primaryImage || 'assets/orders/shirt.jpg'
          }));

          return {
            id: orderId,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'Recently',
            fullDate: o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Recently, 02:30 PM',
            status: status,
            product: firstItem.title || firstItem.name || 'Men’s Premium Apparel',
            meta: `Size: ${firstItem.size || 'L'}  |  Qty: ${firstItem.quantity || 1}`,
            price: typeof amt === 'number' ? `₹${amt.toLocaleString('en-IN')}` : amt,
            numericPrice: typeof amt === 'number' ? amt : (parseInt(String(amt).replace(/\D/g, ''), 10) || 899),
            image: firstItem.image || firstItem.primaryImage || 'assets/orders/shirt.jpg',
            buttons: status === 'delivered' ? ["Buy Again", "Write a Review"] : (status === 'shipped' ? ["Track Order"] : []),
            tracking: status === 'shipped',
            carrier: o.carrier || "BlueDart Express",
            awb: o.awb || ("BLD" + String(orderId).replace(/\D/g, '') + "99IN"),
            estDelivery: status === 'delivered' ? "Delivered" : "Expected in 2-3 business days",
            paymentMethod: o.paymentMethod || "Cash on Delivery",
            paymentStatus: status === 'delivered' ? 'Paid' : (o.paymentMethod?.includes('Cash') ? 'Pay on Delivery' : 'Paid'),
            shippingAddress: o.address || {
              name: user?.name || user?.displayName || "Customer",
              phone: user?.phone || "+91 98765 43210",
              address: "Delivery Address on File",
              city: "Delhi NCR",
              state: "Delhi",
              pincode: "110001"
            },
            items: itemsList,
            pricing: {
              subtotal: typeof amt === 'number' ? amt : (parseInt(String(amt).replace(/\D/g, ''), 10) || 899),
              deliveryFee: 0,
              discount: 0,
              tax: "Included (GST 18%)",
              total: typeof amt === 'number' ? amt : (parseInt(String(amt).replace(/\D/g, ''), 10) || 899)
            }
          };
        });

        // Merge custom orders with demo orders
        activeOrders = [...formatted, ...DEMO_ORDERS];
      }
    } catch(err) {
      console.warn('Orders sync error:', err);
    }
    render();
    updateCartBadge();

    // Check if URL has orderId or id parameter to directly open detailed view
    const initialOrderId = urlParams.get('orderId') || urlParams.get('id');
    if (initialOrderId) {
      setTimeout(() => {
        showOrderDetail(initialOrderId);
      }, 50);
    }
  }

  // Initial render
  loadUserOrders();
  window.addEventListener('storage', updateCartBadge);

  // Expose global for testing and external triggers
  window.StyleHubOrders = {
    showOrderDetail,
    closeOrderDetail,
    showInvoiceModal,
    buyAgain
  };
})();
