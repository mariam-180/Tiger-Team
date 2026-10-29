# Administration workspace

Sign in using the existing administrator account, then open `/admin`. Local development credentials are kept in the ignored `.local/admin-access.txt` file. This local account is separate from the email sender.

The overview explains each tool. The navigation remains available inside every section. The site uses one administrator account and customer accounts. All management tools require the administrator role. The interface does not offer employee roles, account promotion, or deletion of the administrator account. Backend permission checks remain authoritative.

| Tool | Purpose |
| --- | --- |
| Users | Find customer accounts, review credit and manage available account fields. |
| Reservations | Review PC reservations and update booking records. |
| Orders | Review purchased items and existing order statuses. |
| Products | Add and edit products, images, prices and stock. Search and pagination apply to the loaded catalogue. |
| Events | Review registrations for existing events. This screen is not an event-creation editor. |
| Streaming | Access streaming configuration; an actual broadcast also needs the media server and a publisher such as OBS. |
| Settings | Edit existing site controller records. Confirm the purpose of a control before changing it. |
| Reports | Review recorded activity. |

The Users screen now contains account management only. Activity history and its filters are consolidated under Reports, where “Changed by” means the account that performed the action, “Action” means create/update/delete, and “Area” identifies the affected record type. Date ranges include the entire final day. Reports are an audit log, not traffic or sales analytics.

Reservations exclude permanently closed Snokardo. “Include ended bookings” adds historical bookings to the list. “Unreviewed only” shows bookings without a review checkmark. Review checkmarks apply to the current visit, reset when a record changes and do not indicate payment or booking confirmation. Editing started bookings is unavailable; the backend checks availability and recalculates cost for time changes.

## Decisions needed from the owner

1. Payment and credit: are bookings and orders paid from customer credit, at the venue, or through an online payment provider? Who can add credit, and what evidence or receipt is required?
2. Cancellations and refunds: when are cancellations allowed, what happens to credit, and should historical records be retained instead of deleted?
3. Only the site administrator manages prices, balances and booking records; customers use the public site. No employee workflow is required.
4. Race operations: who creates events, sets dates and capacity, and determines paid/confirmed registrations? The current event screen manages registrations.
5. Production setup: confirm currency, timezone, production domain and SMTP provider for `info@tigers-team.com`.

These decisions have not been replaced by invented rules. Existing server-side payment and status behavior is preserved. A real email sender is still required before real verification and password-reset messages can be delivered.

## رسالة مبسطة لصاحب الموقع

محتاجين نتأكد إن الموقع ماشي بنفس طريقة شغل المكان. ممكن توضح لنا الآتي؟

1. **العميل بيدفع إزاي؟** لما يحجز جهاز أو يطلب منتج، هل بيدفع في الفرع، ولا لازم يشحن رصيد في حسابه الأول، ولا مطلوب يدفع أونلاين؟ ولو فيه شحن رصيد، مين من الموظفين يقدر يضيفه وإزاي بنتأكد إن الفلوس اتدفعت؟
2. **لو العميل لغى الحجز أو الطلب، بنعمل إيه؟** هل مسموح الإلغاء في أي وقت ولا قبل الموعد بمدة معينة؟ وهل الفلوس أو الرصيد بيرجعوا؟ والأفضل نحتفظ بالعملية بحالة «ملغية» عشان نرجع لها بدل ما نمسحها؟
3. **الحسابات:** تم توضيح أن الموقع فيه أدمن واحد وحسابات عملاء فقط، من غير نظام موظفين. إدارة الأسعار والرصيد والحجوزات تكون للأدمن.
4. **البطولات بتتدار إزاي؟** مين بيحدد اسم البطولة وموعدها وسعر الاشتراك وعدد المشاركين؟ وإمتى بنعتبر اشتراك اللاعب مؤكد: بعد التسجيل مباشرة ولا بعد الدفع ومراجعة الموظف؟
5. **تفاصيل التشغيل:** العملة المطلوبة إيه، والفروع كلها على توقيت مصر؟ وإيميل `info@tigers-team.com` بتفتحوه من أي شركة أو صفحة بريد عشان نربط إرسال رسائل التأكيد واسترجاع الباسورد؟

مش مطلوب منه يقرر تفاصيل برمجية؛ المطلوب يشرح طريقة الشغل الفعلية. ما نبعتش كلمات مرور أو مفاتيح سرية في الشات.

The administrator uses `/admin/reservations` and `/admin/products`. Visiting the customer booking or shop routes while signed in as the administrator redirects to those management tools. Home, championship and FAQ URLs redirect the administrator into the management workspace; those public pages retain their customer presentation for visitors and customers. The Live page links staff to broadcast setup and visitors to championship information.
