export const site = {
  origin: 'https://www.heypalpatch.com',
  brand: 'Heypal Patch',
  email: 'heypal01@163.com',
  phoneDisplay: '+86 183 9080 0841',
  phoneSchema: '+8618390800841',
  whatsapp: 'https://wa.me/8618390800841',
  whatsappText: 'Hello Heypal Patch, I would like to request a quotation for custom patches. I can provide my artwork, size, quantity and shipping country.',
  location: 'China',
  image: '/assets/patch-embroidered.webp',
  description: 'Heypal Patch helps brands, teams, clubs and merchandise buyers coordinate custom patch orders. We review project requirements, compare patch materials, prepare quotations, coordinate digital proofs, arrange production after approval and provide shipment photos and tracking information before delivery.'
};

export const facts = {
  embroideredMoq: '50 pieces',
  otherMoq: '100 pieces',
  sample: 'Physical samples are available with a sample fee.',
  proof: 'Usually approximately 3-4 days after order details and artwork requirements are confirmed.',
  production: 'Usually approximately 8-10 days after the customer approves the digital proof.',
  shipping: 'Small-parcel logistics such as 4PX or international express couriers including DHL, FedEx and UPS.',
  payment: 'PayPal payment is available for confirmed orders.',
  photos: 'Finished product or shipment photos are provided before dispatch, with tracking information after shipping.'
};

export const products = [
  {
    slug: 'custom-embroidered-patches',
    name: 'Custom Embroidered Patches',
    short: 'Classic raised-thread patches for uniforms, hats, jackets and merchandise.',
    image: '/assets/patch-embroidered.webp',
    title: 'Custom Embroidered Patches | Heypal Patch',
    description: 'Order custom embroidered patches from 50 pieces with digital proof approval, backing guidance, sample support and international shipping coordination from China.',
    direct: 'An embroidered patch is a fabric patch made with stitched thread over a twill or fabric base. It is commonly used for uniforms, hats, jackets and merchandise. Heypal Patch accepts embroidered patch orders from 50 pieces and provides a digital proof for approval before bulk production is arranged.',
    texture: 'Raised thread, visible stitch direction and a classic tactile surface.',
    detail: 'Best for bold logos, readable lettering and simple color blocks. Very small text, gradients and photo details may need woven or printed patches instead.',
    backings: ['Sew-on', 'Iron-on', 'Hook and loop', 'Adhesive', 'No backing'],
    borders: ['Merrowed border for simple shapes', 'Heat-cut edge for custom outlines'],
    bestFor: ['Uniform patches', 'Hat patches', 'Team badges', 'Merchandise patches'],
    notIdeal: ['Photo-realistic artwork', 'Very tiny lettering', 'Smooth gradients'],
    compare: ['custom-woven-patches', 'custom-pvc-patches', 'embroidered-vs-woven-patches']
  },
  {
    slug: 'custom-woven-patches',
    name: 'Custom Woven Patches',
    short: 'Flat fine-yarn patches for small text, labels and detailed artwork.',
    image: '/assets/patch-woven.webp',
    title: 'Custom Woven Patches for Fine Detail | Heypal Patch',
    description: 'Compare custom woven patches for detailed logos, labels and small text, with 100-piece standard MOQ, proof approval and shipping support.',
    direct: 'A woven patch uses fine threads woven into a flatter surface than embroidery. It is a practical choice when a logo has small text, thin lines or detailed shapes. Heypal Patch coordinates woven patch orders from 100 pieces, with a digital proof prepared before bulk production is arranged.',
    texture: 'Smooth, flat textile surface with fine yarn detail.',
    detail: 'Better than embroidery for small lettering and thin lines, but not suitable for photographic gradients.',
    backings: ['Sew-on', 'Iron-on', 'Hook and loop', 'Adhesive'],
    borders: ['Heat-cut edge', 'Laser-cut edge', 'Merrowed border for simple shapes'],
    bestFor: ['Detailed brand labels', 'Small text', 'Retail merchandise', 'Uniform labels'],
    notIdeal: ['Raised stitch texture', '3D rubber effects', 'Photo gradients'],
    compare: ['custom-embroidered-patches', 'custom-printed-patches', 'embroidered-vs-woven-patches']
  },
  {
    slug: 'custom-pvc-patches',
    name: 'Custom PVC Patches',
    short: 'Molded rubber patches for outdoor gear, bags and removable patch systems.',
    image: '/assets/patch-pvc.webp',
    title: 'Custom PVC Patches for Gear and Bags | Heypal Patch',
    description: 'Order custom PVC patches with molded rubber detail, 100-piece standard MOQ, digital proof approval and international shipping support.',
    direct: 'A PVC patch is a flexible molded rubber patch with layered color areas and a durable surface. It works well for outdoor gear, bags, morale patches and bold logos. Heypal Patch coordinates PVC patch orders from 100 pieces and arranges production only after the customer approves the digital proof.',
    texture: 'Flexible rubber surface with raised and recessed molded areas.',
    detail: 'Good for bold shapes and clean color separation. Extremely fine lines, tiny text and gradients may need printed or woven patches.',
    backings: ['Hook and loop', 'Sew-on channel', 'Adhesive for selected uses'],
    borders: ['Molded raised border', 'Custom die-cut edge'],
    bestFor: ['Outdoor gear', 'Bags and backpacks', 'Morale patches', 'Weather-resistant branding'],
    notIdeal: ['Soft textile texture', 'Photo detail', 'Very thin script lettering'],
    compare: ['custom-embroidered-patches', 'custom-velcro-patches', 'pvc-vs-embroidered-patches']
  },
  {
    slug: 'custom-chenille-patches',
    name: 'Custom Chenille Patches',
    short: 'Plush varsity-style patches for letters, numbers and statement graphics.',
    image: '/assets/patch-chenille.webp',
    title: 'Custom Chenille Patches for Varsity Style | Heypal Patch',
    description: 'Plan custom chenille patches for varsity letters, fashion patches and bold graphics, with proof approval and order coordination from China.',
    direct: 'A chenille patch uses plush loop yarn over a felt or fabric base, creating a soft varsity-style texture. It is best for large letters, numbers and bold shapes. Heypal Patch coordinates chenille patch orders from 100 pieces and confirms the digital proof before bulk production is arranged.',
    texture: 'Soft loop yarn with a thick, fuzzy surface.',
    detail: 'Best for bold artwork. Small text and detailed outlines can be difficult because the loop yarn needs space.',
    backings: ['Sew-on', 'Iron-on for suitable fabrics', 'No backing'],
    borders: ['Felt edge', 'Embroidered border', 'Heat-cut edge where suitable'],
    bestFor: ['Varsity letters', 'Fashion patches', 'Large jacket patches', 'Team numbers'],
    notIdeal: ['Small text', 'Fine logos', 'High-detail illustrations'],
    compare: ['custom-embroidered-patches', 'custom-patches-for-jackets', 'how-to-design-a-custom-patch']
  },
  {
    slug: 'custom-leather-patches',
    name: 'Custom Leather Patches',
    short: 'Leather and PU leather labels for hats, denim, workwear and bags.',
    image: '/assets/patch-leather.webp',
    title: 'Custom Leather Patches for Hats and Apparel | Heypal Patch',
    description: 'Coordinate custom leather patches for hats, denim, bags and apparel labels with proof approval, sample support and PayPal payment.',
    direct: 'A leather patch is a branded label made from genuine leather or PU leather, often with embossed, debossed or laser engraved artwork. It is commonly used on hats, denim, workwear and bags. Heypal Patch coordinates leather patch orders from 100 pieces and provides proof approval before production is arranged.',
    texture: 'Natural or synthetic leather surface with engraved or pressed artwork.',
    detail: 'Best for simple marks, wordmarks and label artwork. Fine color artwork usually works better as printed or woven patches.',
    backings: ['Sew-on', 'Adhesive for selected applications', 'No backing'],
    borders: ['Cut edge', 'Stitched edge', 'Rounded corners'],
    bestFor: ['Hat labels', 'Denim patches', 'Workwear branding', 'Bag labels'],
    notIdeal: ['Full-color illustrations', 'Wash-heavy applications without testing', 'Tiny multi-color logos'],
    compare: ['custom-patches-for-hats', 'custom-sew-on-patches', 'patch-care-guide']
  },
  {
    slug: 'custom-printed-patches',
    name: 'Custom Printed Patches',
    short: 'Flat printed patches for gradients, illustrations and photo-style graphics.',
    image: '/assets/patch-printed.webp',
    title: 'Custom Printed Patches for Full-Color Artwork | Heypal Patch',
    description: 'Coordinate custom printed patches for gradients, detailed artwork and event graphics, with 100-piece standard MOQ and digital proof approval.',
    direct: 'A printed patch uses a flat printed textile surface, making it suitable for gradients, illustrations, photo-style artwork and complex color transitions. Heypal Patch coordinates printed patch orders from 100 pieces and prepares a digital proof before bulk production is arranged after approval.',
    texture: 'Flat fabric surface with printed color detail.',
    detail: 'Best for gradients and complex artwork, but it does not provide the raised thread texture of embroidery.',
    backings: ['Sew-on', 'Iron-on', 'Adhesive for selected uses'],
    borders: ['Heat-cut edge', 'Laser-cut edge', 'Merrowed border for simple shapes'],
    bestFor: ['Photo-style graphics', 'Event patches', 'Illustrated logos', 'Gradient artwork'],
    notIdeal: ['Raised texture', 'Molded rubber depth', 'Natural leather label look'],
    compare: ['custom-woven-patches', 'custom-embroidered-patches', 'custom-patch-file-formats']
  }
];

export const intentPages = [
  ['custom-iron-on-patches', 'Custom Iron-On Patches', 'Plan custom iron-on patches for suitable fabrics with heat-activated backing, proof approval and practical application guidance.', 'Iron-on patches use heat-activated backing so the patch can be applied to suitable fabrics with heat and pressure. Sewing may still be recommended for high-wear garments, heavy fabrics or repeated washing. Heypal Patch coordinates iron-on patch orders with backing guidance and digital proof approval before bulk production is arranged.', 'backing-iron-on.webp', ['custom-embroidered-patches', 'iron-on-vs-sew-on-patches', 'patch-backing-options']],
  ['custom-velcro-patches', 'Custom Velcro Patches', 'Coordinate custom hook-and-loop patches for uniforms, bags and removable patch systems with proof approval and shipping support.', 'Hook-and-loop patches are designed for removable use on uniforms, bags, tactical gear and morale patch panels. The patch usually includes a hook side, and the matching loop side can be planned with the order when needed. Heypal Patch coordinates the patch type, backing and proof before production is arranged.', 'backing-velcro-hook-loop.webp', ['custom-pvc-patches', 'patch-backing-options', 'iron-on-vs-sew-on-patches']],
  ['custom-sew-on-patches', 'Custom Sew-On Patches', 'Order sew-on patches for durable attachment on jackets, uniforms, hats and bags with material guidance and proof approval.', 'Sew-on patches are made for stitching onto garments, hats, bags or gear. This backing is often selected when long-term durability is more important than quick application. Heypal Patch helps buyers choose material, edge style and size before arranging a digital proof and coordinating bulk production after approval.', 'backing-sew-on.webp', ['custom-embroidered-patches', 'iron-on-vs-sew-on-patches', 'custom-patches-for-jackets']],
  ['custom-logo-patches', 'Custom Logo Patches', 'Coordinate custom logo patches for brands, teams and merchandise with artwork review, proof approval and shipping support.', 'Custom logo patches turn a brand mark, team badge or club emblem into a wearable patch. The best material depends on the logo detail, color count, size and intended application. Heypal Patch reviews the artwork, recommends practical specifications and coordinates the order after the buyer approves the digital proof.', 'patch-materials-closeup.webp', ['patch-types', 'how-to-design-a-custom-patch', 'get-a-quote']],
  ['custom-name-patches', 'Custom Name Patches', 'Plan custom name patches for uniforms, teams and workwear with readable lettering, backing guidance and proof approval.', 'Custom name patches are usually designed around readable text, consistent sizing and a backing that suits the garment. Embroidered and woven patches are common choices, depending on the lettering size and detail. Heypal Patch coordinates name patch orders after confirming artwork, quantity, backing and shipping country.', 'patch-woven.webp', ['custom-woven-patches', 'custom-embroidered-patches', 'custom-patch-file-formats']],
  ['custom-patches-for-jackets', 'Custom Patches for Jackets', 'Coordinate jacket patches for clubs, teams, fashion labels and merchandise with material and backing guidance.', 'Jacket patches need careful planning around size, edge style, backing and fabric type. Large statement patches may use chenille or embroidery, while detailed labels may use woven or printed methods. Heypal Patch helps buyers compare options, approve a digital proof and arrange production after approval.', 'patch-chenille.webp', ['custom-chenille-patches', 'custom-sew-on-patches', 'patch-care-guide']],
  ['custom-patches-for-hats', 'Custom Patches for Hats', 'Plan custom hat patches with suitable size, material and backing options for caps, beanies and headwear.', 'Hat patches usually need compact artwork, readable text and a shape that fits the front panel, side panel or beanie cuff. Embroidered, woven, leather and PVC patches can all work depending on the design. Heypal Patch coordinates specifications and proof approval before production is arranged.', 'patch-leather.webp', ['custom-leather-patches', 'custom-embroidered-patches', 'custom-patch-size-guide']],
  ['custom-patches-for-uniforms', 'Custom Patches for Uniforms', 'Coordinate custom uniform patches for teams, clubs and workwear with proof approval and consistent order details.', 'Uniform patches often require consistent size, readable text, durable backing and repeatable color references. Embroidered and woven patches are common, while PVC may suit removable hook-and-loop systems. Heypal Patch helps buyers confirm patch specifications before production is arranged after proof approval.', 'patch-embroidered.webp', ['custom-embroidered-patches', 'custom-velcro-patches', 'custom-patch-order-process']],
  ['custom-patches-for-backpacks', 'Custom Patches for Backpacks', 'Order backpack patches for outdoor gear, retail bags and merchandise with backing guidance and shipping coordination.', 'Backpack patches may use sew-on, hook-and-loop or adhesive backing depending on the bag material and expected wear. PVC works well for outdoor styles, while woven, embroidered and leather options suit brand labels. Heypal Patch coordinates the order details and proof approval before arranging production.', 'patch-pvc.webp', ['custom-pvc-patches', 'custom-velcro-patches', 'shipping-and-payment']]
];

export const guidePages = [
  ['embroidered-vs-woven-patches', 'Embroidered vs Woven Patches', 'Compare embroidered and woven patches by texture, detail, small text, backing options and typical use before requesting a quote.', 'Embroidered patches create raised thread texture, while woven patches use finer yarn for a flatter and more detailed surface. The better choice depends on your logo detail, text size, preferred texture and application. Heypal Patch helps buyers compare both options before preparing a quotation and digital proof.', ['custom-embroidered-patches', 'custom-woven-patches', 'get-a-quote']],
  ['pvc-vs-embroidered-patches', 'PVC vs Embroidered Patches', 'Compare PVC and embroidered patches for durability, texture, detail limits, removable backing and common applications.', 'PVC patches have a flexible molded rubber surface, while embroidered patches have a raised thread surface on fabric. PVC is often selected for gear and outdoor use; embroidery is a classic choice for uniforms, hats and merchandise. Heypal Patch can compare both options against your artwork and intended application.', ['custom-pvc-patches', 'custom-embroidered-patches', 'custom-velcro-patches']],
  ['iron-on-vs-sew-on-patches', 'Iron-On vs Sew-On Patches', 'Compare iron-on and sew-on patch backing options for durability, application method and garment suitability.', 'Iron-on backing can be convenient for suitable fabrics, while sew-on backing is often chosen for long-term durability and high-wear garments. The right backing depends on fabric, wash expectations and how the patch will be used. Heypal Patch can recommend a practical backing after reviewing your application.', ['custom-iron-on-patches', 'custom-sew-on-patches', 'patch-backing-options']],
  ['merrowed-border-vs-heat-cut-border', 'Merrowed Border vs Heat-Cut Border', 'Compare merrowed and heat-cut patch borders for shape, edge thickness and artwork style.', 'A merrowed border creates a wrapped stitched edge around simple shapes, while a heat-cut border follows more detailed custom outlines. The right edge depends on patch shape, material and artwork. Heypal Patch helps buyers confirm border options during proof review before production is arranged.', ['patch-border-options', 'custom-embroidered-patches', 'custom-patch-order-process']],
  ['how-much-do-custom-patches-cost', 'How Much Do Custom Patches Cost?', 'Understand the main factors that affect custom patch cost without fixed price claims or unrealistic promises.', 'Custom patch cost depends on patch type, finished size, quantity, number of colors, design complexity, backing, border, sample requirements and shipping destination. Heypal Patch prepares quotations after reviewing confirmed project details, so buyers receive pricing based on the actual order requirements.', ['samples-and-moq', 'shipping-and-payment', 'get-a-quote']],
  ['how-to-design-a-custom-patch', 'How to Design a Custom Patch', 'Prepare artwork for custom patches with guidance on size, text, color, borders, backing and proof review.', 'A good custom patch design starts with clear artwork, readable text, practical line thickness and a material choice that fits the intended use. Heypal Patch reviews artwork and helps buyers adjust specifications before a digital proof is prepared for approval.', ['custom-patch-file-formats', 'patch-types', 'get-a-quote']],
  ['custom-patch-file-formats', 'Custom Patch File Formats', 'Learn which artwork files to send for custom patches and how vector, raster and reference files are reviewed.', 'Vector files are useful for clean logos, while high-resolution PNG, JPG or PDF files can help communicate color and layout. If the artwork is not production ready, Heypal Patch can still review the design and advise what is needed before proof preparation.', ['how-to-design-a-custom-patch', 'custom-logo-patches', 'get-a-quote']],
  ['patch-care-guide', 'Patch Care Guide', 'Learn practical care guidance for custom patches on hats, jackets, uniforms and bags.', 'Patch care depends on material, backing and the garment it is attached to. Sewn patches generally handle wear better than temporary adhesive applications, and heat-applied patches should be treated carefully during washing. Heypal Patch can advise care considerations based on the chosen patch type.', ['custom-sew-on-patches', 'custom-patches-for-jackets', 'custom-leather-patches']]
];

export const faqItems = [
  ['What is the minimum order quantity?', 'The standard MOQ is 50 pieces for embroidered patches and 100 pieces for most other patch types. Final requirements may depend on the design, size and production method.'],
  ['Do you provide physical samples?', 'Yes. Physical samples are available with a sample fee. The fee depends on the artwork, size, number of colors, material and production requirements.'],
  ['How long does a digital proof take?', 'A digital proof is usually prepared within approximately 3-4 days after the order information and artwork requirements are confirmed.'],
  ['How long does bulk production take?', 'Bulk production usually takes approximately 8-10 days after the customer approves the digital proof. Timing may vary depending on the patch type, quantity and artwork complexity.'],
  ['Will I approve the design before production?', 'Yes. The customer reviews and approves the digital proof before bulk production is arranged.'],
  ['Which payment method do you accept?', 'PayPal payment is available for confirmed orders.'],
  ['How are orders shipped?', 'Orders can generally be shipped through small-parcel logistics services such as 4PX or international express couriers including DHL, FedEx and UPS. Available options depend on the destination and package details.'],
  ['Will I receive photos before shipping?', 'Yes. Finished product or shipment photos are provided before dispatch, together with tracking information after the parcel is shipped.']
];

export const orderSteps = [
  ['Send an Inquiry', 'Share artwork or logo, patch type, finished size, quantity, backing, intended application, shipping country and delivery requirement.'],
  ['Receive a Quotation', 'Heypal Patch reviews design, size, colors, quantity, material, backing, border and shipping requirements before preparing a quotation.'],
  ['Place the Order', 'After the quotation is confirmed, PayPal payment is available for the confirmed order. PayPal account details are not published on the website.'],
  ['Digital Proof Preparation', 'A digital proof is usually prepared within approximately 3-4 days after order details and artwork requirements are confirmed.'],
  ['Customer Approval', 'The customer checks shape, size, colors, text, border, backing and overall layout before bulk production is arranged.'],
  ['Bulk Production', 'Production is arranged after the customer approves the digital proof. Timing is usually approximately 8-10 days and may vary by order.'],
  ['Shipment Confirmation', 'Finished product or shipment photos are provided before dispatch where available, together with shipping confirmation.'],
  ['Delivery Tracking', 'Tracking information is provided after shipping so the buyer can follow the parcel.']
];

export const redirects = [
  ['/index.html', '/'],
  ['/custom-hat-patches', '/custom-patches-for-hats'],
  ['/custom-uniform-patches', '/custom-patches-for-uniforms'],
  ['/how-it-works', '/custom-patch-order-process'],
  ['/how-to-order-custom-patches', '/custom-patch-order-process'],
  ['/custom-patch-artwork-guide', '/how-to-design-a-custom-patch'],
  ['/iron-on-patches-backing-guide', '/iron-on-vs-sew-on-patches'],
  ['/velcro-patches-hook-and-loop-backing-guide', '/custom-velcro-patches']
];
