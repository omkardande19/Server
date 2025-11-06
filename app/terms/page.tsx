import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms and Conditions | Artist Katta",
  description: "Terms and Conditions, Privacy Policy, Cancellation & Refunds Policy, and Shipping Policy for Artist Katta",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
          <p className="text-gray-400">Last updated: November 6, 2025</p>
        </div>

        <div className="space-y-12">
          {/* Cancellation & Refunds Policy */}
          <section className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Cancellation & Refunds Policy</h2>
            <p className="text-gray-300 mb-4">
              Thank you for registering on Artist Katta. If you are not entirely satisfied with your purchase, we're here to help.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Conditions for Returns</h3>
            <p className="text-gray-300 mb-3">
              You have <strong>7 calendar days</strong> to return an item from the date you received it.
            </p>
            <p className="text-gray-300 mb-3">To be eligible for a return, please ensure that:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
              <li>The item is in its original packaging.</li>
              <li>The item is unused and in the same condition that you received it.</li>
              <li>You have the receipt or proof of purchase.</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Non-Returnable Items</h3>
            <p className="text-gray-300 mb-4">
              Certain items cannot be returned, including products made to your specifications, personalized items, goods not suitable for return due to health or hygiene reasons if unsealed, and perishable goods past their expiry date. We reserve the right to refuse returns that do not meet these conditions.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">How to Return an Item</h3>
            <p className="text-gray-300 mb-4">
              To initiate a return, email us at <a href="mailto:support@artistkatta.com" className="text-primary hover:underline">support@artistkatta.com</a> with your order number and reason for return. You will be provided with instructions and the return address. You are responsible for return shipping costs and risks, so using a trackable service is recommended.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Refunds</h3>
            <p className="text-gray-300 mb-4">
              Upon receiving and inspecting your returned item, we will notify you of the status of your refund or exchange. If approved, a refund will be issued to your original payment method. Please allow time for your bank to process the refund.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Cancellation Policy</h3>
            <p className="text-gray-300">
              Orders can be cancelled within <strong>2 hours</strong> if they haven't shipped. Shipped orders fall under the standard returns policy.
            </p>
          </section>

          {/* Terms and Conditions */}
          <section className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">2. Terms and Conditions</h2>
            <p className="text-gray-300 mb-4">
              Please read these Terms and Conditions ("Terms") carefully before using the <Link href="/" className="text-primary hover:underline">www.artistkatta.com</Link> website (the "Service") operated by <strong>Zetavomi Technology Pvt Ltd</strong> ("Us", "We", or "Our").
            </p>
            <p className="text-gray-300 mb-4">
              Your use of the Service is subject to your acceptance of these Terms. By using the Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Accounts</h3>
            <p className="text-gray-300 mb-4">
              When creating an account, you must provide accurate and current information and are responsible for safeguarding your password and all account activities.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Intellectual Property</h3>
            <p className="text-gray-300 mb-4">
              The Service and its content are the exclusive property of <strong>Zetavomi Technology Pvt Ltd</strong> and its licensors. Our trademarks cannot be used without our prior written consent.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Links to Other Websites</h3>
            <p className="text-gray-300 mb-4">
              The Service may link to third-party websites not controlled by <strong>Zetavomi Technology Pvt Ltd</strong>. We are not responsible for the content, privacy policies, or practices of these sites.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Limitation of Liability</h3>
            <p className="text-gray-300 mb-4">
              <strong>Zetavomi Technology Pvt Ltd</strong>, including its affiliates, is not liable for indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Governing Law</h3>
            <p className="text-gray-300 mb-4">
              These Terms are governed by the laws of <strong>India</strong>.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Changes</h3>
            <p className="text-gray-300">
              We may modify these Terms at any time. For material revisions, we will provide at least <strong>30 days' notice</strong>.
            </p>
          </section>

          {/* Shipping Policy */}
          <section className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">3. Shipping Policy</h2>
            <p className="text-gray-300 mb-4">
              This Shipping Policy outlines our shipping procedures.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Order Processing Time</h3>
            <p className="text-gray-300 mb-4">
              Orders are processed within <strong>1 to 3 business days</strong>, excluding weekends and holidays.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Shipping Methods, Costs, and Delivery Times</h3>
            <p className="text-gray-300 mb-4">
              Shipping costs are calculated at checkout based on order details. We offer various shipping options with estimated delivery times and costs. These times are estimates and may vary.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Shipping Confirmation and Order Tracking</h3>
            <p className="text-gray-300 mb-4">
              A shipment confirmation email with a tracking number is sent once your order ships. The tracking number should be active within <strong>24 to 48 hours</strong>.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Shipping Restrictions</h3>
            <p className="text-gray-300 mb-4">
              We do not ship to P.O. Boxes or military addresses.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Damaged or Lost Packages</h3>
            <p className="text-gray-300">
              Contact us immediately for damaged orders to file a claim. If your package is lost, contact us to initiate an investigation with the shipping company.
            </p>
          </section>

          {/* Privacy Policy */}
          <section className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">4. Privacy Policy</h2>
            <p className="text-gray-300 mb-4">
              This Privacy Policy describes how personal information is collected and used on <Link href="/" className="text-primary hover:underline">http://artistkatta.com</Link> (the "Site").
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Personal Information We Collect</h3>
            <p className="text-gray-300 mb-4">
              When you visit the Site, we collect device information such as your browser, IP address, and time zone. When you make a purchase, we collect information including your name, address, email, and phone number.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">How We Use Your Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We use order information to fulfill orders, process payments, arrange shipping, and provide invoices. This information is also used to communicate with you, screen for risk or fraud, and provide relevant information or advertising based on your preferences.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Sharing Your Personal Information</h3>
            <p className="text-gray-300 mb-4">
              We share your personal information with third parties to operate our store and services, and Google Analytics to understand site usage. We may also share information to comply with laws, respond to legal requests, or protect our rights.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Your Rights</h3>
            <p className="text-gray-300 mb-4">
              European residents have the right to access, correct, update, or delete their personal information. Contact us using the details below to exercise these rights.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Data Retention</h3>
            <p className="text-gray-300">
              We retain your order information unless you request its deletion.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              For questions about these Policies, your order, or our practices, please contact us:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>
                <strong>By email:</strong> <a href="mailto:support@artistkatta.com" className="text-primary hover:underline">support@artistkatta.com</a>
              </li>
              <li>
                <strong>By visiting this page on our website:</strong> <Link href="/" className="text-primary hover:underline">artistkatta.com</Link>
              </li>
              <li>
                <strong>By phone:</strong> <a href="tel:9503987878" className="text-primary hover:underline">9503987878</a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

