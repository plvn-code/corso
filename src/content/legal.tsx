import Link from "next/link";
import { site } from "@/lib/site";
import { PREPAY_MIN } from "@/lib/prepay";
import { ReturnForm } from "@/components/ReturnForm";

/**
 * Client-care texts (2026-11-25). Seller details and terms come from the client:
 * ФОП, IBAN/bank, goods = clothing & accessories, all delivery methods, returns per the reference she sent.
 * The return period follows the Law of Ukraine «Про захист прав споживачів» (14 days).
 */

const L = site.legal;
/** Link to the manager on Telegram — brand wording only, never a personal nickname (client, 2026-11-25). */
const Manager = ({ children = "Telegram" }: { children?: React.ReactNode }) => (
  <a href={site.manager} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
const Insta = () => (
  <a href={site.instagram} target="_blank" rel="noopener noreferrer">
    {site.instagramHandle}
  </a>
);

/* ---------------- requisites ---------------- */
export function RequisitesUk() {
  return (
    <dl className="reqs">
      <dt>Отримувач</dt>
      <dd>{L.name}</dd>
      <dt>РНОКПП (ІПН)</dt>
      <dd>{L.ipn}</dd>
      <dt>IBAN</dt>
      <dd className="reqs__mono">{L.iban}</dd>
      <dt>Банк</dt>
      <dd>{L.bank}</dd>
      <dt>МФО</dt>
      <dd>{L.mfo}</dd>
      <dt>ЄДРПОУ банку</dt>
      <dd>{L.bankCode}</dd>
    </dl>
  );
}
export function RequisitesEn() {
  return (
    <dl className="reqs">
      <dt>Beneficiary</dt>
      <dd>
        {L.nameEn} ({L.name})
      </dd>
      <dt>Tax ID</dt>
      <dd>{L.ipn}</dd>
      <dt>IBAN</dt>
      <dd className="reqs__mono">{L.iban}</dd>
      <dt>Bank</dt>
      <dd>
        {L.bankEn} ({L.bank})
      </dd>
      <dt>MFO</dt>
      <dd>{L.mfo}</dd>
      <dt>Bank code (EDRPOU)</dt>
      <dd>{L.bankCode}</dd>
    </dl>
  );
}

/* ---------------- payment & delivery ---------------- */
export const PaymentDeliveryUk = (
  <>
    <h2>Доставка</h2>
    <ul className="dash">
      <li>Нова пошта по всій Україні — у відділення, поштомат або адресна доставка курʼєром до дверей.</li>
      <li>Відправка протягом 1–2 днів після підтвердження замовлення.</li>
      <li>
        Самовивіз — наш магазин у Дніпрі, {site.address}.
      </li>
      <li>Вартість доставки — за тарифами перевізника.</li>
    </ul>
    <h2>Оплата</h2>
    <ul className="dash">
      <li>Карткою онлайн на сайті — Visa, Mastercard, Apple Pay, Google Pay (підключається).</li>
      <li>Переказ на рахунок ФОП за реквізитами нижче.</li>
      <li>
        Накладений платіж з передоплатою — стартова передоплата від {PREPAY_MIN} грн онлайн. Можна внести більше: сума передоплати на ваш вибір,
        але не менше {PREPAY_MIN} грн. Решту сплачуєте при отриманні на пошті.
      </li>
      <li>
        <Link href="/gift-certificate">Подарунковим сертифікатом</Link> CORSO.
      </li>
    </ul>
    <h2>Реквізити для оплати</h2>
    <RequisitesUk />
    <h2>Опт</h2>
    <p>Опт — від 6 одиниць однієї моделі. Накладеного платежу на опт немає.</p>
  </>
);
export const PaymentDeliveryEn = (
  <>
    <h2>Delivery</h2>
    <ul className="dash">
      <li>Nova Poshta across Ukraine — to a branch, a parcel locker or by courier to your door.</li>
      <li>Dispatched within 1–2 days after the order is confirmed.</li>
      <li>Pickup — our store in Dnipro, {site.addressEn}.</li>
      <li>Delivery cost — at the carrier&apos;s rates.</li>
    </ul>
    <h2>Payment</h2>
    <ul className="dash">
      <li>By card online — Visa, Mastercard, Apple Pay, Google Pay (being connected).</li>
      <li>Bank transfer to our business account (details below).</li>
      <li>
        Cash on delivery with prepayment — a starting prepayment from {PREPAY_MIN} UAH online. You can pay more: the amount is up to you, but
        not less than {PREPAY_MIN} UAH. The rest is paid on delivery at the post office.
      </li>
      <li>
        With a CORSO <Link href="/gift-certificate">gift certificate</Link>.
      </li>
    </ul>
    <h2>Bank details</h2>
    <RequisitesEn />
    <h2>Wholesale</h2>
    <p>Wholesale — from 6 pieces of one style. No cash on delivery for wholesale orders.</p>
  </>
);

/* ---------------- returns & exchange ---------------- */
export const ReturnsUk = (
  <>
    <h2>Строк повернення та обміну</h2>
    <p>Повернути або обміняти товар належної якості можна протягом 14 календарних днів відповідно до законодавства України.</p>
    <p>Повернення та обмін здійснюються через той самий канал продажу, через який було придбано товар: інтернет-магазин або магазин у Дніпрі.</p>

    <h2>Умови повернення</h2>
    <p>Повернути товар належної якості можна, якщо:</p>
    <ul className="dash">
      <li>товар не був у використанні, у тому числі для фото- чи відеозйомки;</li>
      <li>збережено товарний вигляд, споживчі властивості, бірки, пломби та оригінальне пакування;</li>
      <li>на товарі відсутні сліди носіння, прання, забруднення, косметичних засобів, шерсті тварин, сторонніх запахів чи інші ознаки використання;</li>
      <li>заповнено електронну заяву на повернення;</li>
      <li>наявний товарний чек.</li>
    </ul>

    <h2>Умови обміну</h2>
    <p>До стану товару та наявності чека застосовуються ті самі вимоги, що й для повернення.</p>
    <p>Обмін здійснюється:</p>
    <ul className="dash">
      <li>на той самий товар в іншому розмірі або кольорі — за наявності;</li>
      <li>після заповнення електронної заяви на обмін.</li>
    </ul>
    <p>Якщо товар у потрібному розмірі або кольорі відсутній, оформлюється повернення коштів відповідно до встановленого порядку.</p>

    <h2>Товари, що не підлягають поверненню та обміну</h2>
    <ul className="dash">
      <li>боді;</li>
      <li>шкарпетки;</li>
      <li>купальники;</li>
      <li>інші товари, які відповідно до законодавства України не підлягають поверненню або обміну.</li>
    </ul>

    <h2>Як оформити повернення або обмін</h2>
    <ol className="steps">
      <li>Перевірити відповідність товару умовам повернення або обміну.</li>
      <li>
        Заповнити <a href="#zayava">електронну заяву</a> на повернення або обмін — форма нижче.
      </li>
      <li>Додати товарний чек.</li>
      <li>Надіслати товар Новою поштою — дані для відправки менеджер повідомить після отримання заяви.</li>
    </ol>
    <p>Витрати на доставку товару під час повернення або обміну оплачує покупець.</p>
    <p>
      <b>
        З питань повернення та обміну можна звернутися до менеджера CORSO в <Manager /> або через Instagram <Insta />.
      </b>
    </p>

    <h2>Електронна заява</h2>
    <ReturnForm />
  </>
);
export const ReturnsEn = (
  <>
    <h2>Return and exchange period</h2>
    <p>Goods of proper quality can be returned or exchanged within 14 calendar days in accordance with Ukrainian law.</p>
    <p>Returns and exchanges go through the same sales channel the item was bought in: the online store or our store in Dnipro.</p>

    <h2>Return conditions</h2>
    <p>An item of proper quality can be returned if:</p>
    <ul className="dash">
      <li>it has not been used, including for photo or video shoots;</li>
      <li>its condition, consumer properties, tags, seals and original packaging are intact;</li>
      <li>there are no signs of wear, washing, dirt, cosmetics, pet hair, foreign odours or other signs of use;</li>
      <li>an online return application has been filled in;</li>
      <li>you have the receipt.</li>
    </ul>

    <h2>Exchange conditions</h2>
    <p>The same requirements for the item&apos;s condition and the receipt apply as for returns.</p>
    <p>An exchange is made:</p>
    <ul className="dash">
      <li>for the same item in another size or colour — subject to availability;</li>
      <li>after filling in an online exchange application.</li>
    </ul>
    <p>If the required size or colour is not available, a refund is issued in the established manner.</p>

    <h2>Items that cannot be returned or exchanged</h2>
    <ul className="dash">
      <li>bodysuits;</li>
      <li>socks;</li>
      <li>swimwear;</li>
      <li>other goods that cannot be returned or exchanged under Ukrainian law.</li>
    </ul>

    <h2>How to return or exchange</h2>
    <ol className="steps">
      <li>Check that the item meets the return or exchange conditions.</li>
      <li>
        Fill in the <a href="#zayava">online application</a> for a return or exchange — the form is below.
      </li>
      <li>Add the receipt.</li>
      <li>Send the item via Nova Poshta — our manager will give you the shipping details after receiving the application.</li>
    </ol>
    <p>Shipping costs for returns and exchanges are paid by the buyer.</p>
    <p>
      <b>
        For returns and exchanges contact the CORSO manager on <Manager /> or via Instagram <Insta />.
      </b>
    </p>

    <h2>Online application</h2>
    <ReturnForm />
  </>
);

/* ---------------- public offer ---------------- */
export const OfferUk = (
  <>
    <p className="muted small">Редакція від 25 листопада 2026 року</p>

    <h2>1. Загальні положення</h2>
    <p>
      1.1. Цей договір є публічною офертою {L.name} (далі — «Продавець») відповідно до статей 633 та 641 Цивільного кодексу України і визначає
      умови продажу товарів бренду CORSO через інтернет-магазин CORSO (далі — «Сайт»), а також через менеджера в Telegram та в магазині
      Продавця.
    </p>
    <p>
      1.2. Акцептом оферти є оформлення замовлення на Сайті, через менеджера або оплата товару. З моменту акцепту договір вважається укладеним
      на умовах, викладених нижче.
    </p>
    <p>1.3. Продавець має право змінювати умови оферти. Чинною є редакція, опублікована на Сайті на момент оформлення замовлення.</p>

    <h2>2. Терміни</h2>
    <ul className="dash">
      <li>«Покупець» — фізична особа, яка оформила замовлення на Сайті, через менеджера або в магазині Продавця.</li>
      <li>«Товар» — жіночий одяг та аксесуари бренду CORSO, представлені на Сайті.</li>
      <li>«Замовлення» — належним чином оформлений запит Покупця на придбання Товару.</li>
    </ul>

    <h2>3. Предмет договору</h2>
    <p>3.1. Продавець зобовʼязується передати у власність Покупцю Товар, а Покупець — прийняти та оплатити його на умовах цього договору.</p>
    <p>
      3.2. Зовнішній вигляд Товару на фото може незначно відрізнятися від оригіналу через налаштування екрана. Опис, склад і розміри Товару
      зазначені на сторінці товару.
    </p>

    <h2>4. Оформлення замовлення</h2>
    <p>4.1. Покупець оформлює замовлення на Сайті, через менеджера CORSO в Telegram або в магазині Продавця.</p>
    <p>4.2. Покупець надає достовірні контактні дані та дані для доставки. Продавець не несе відповідальності за наслідки надання недостовірних даних.</p>
    <p>
      4.3. Після оформлення менеджер підтверджує замовлення: наявність, розмір, вартість і спосіб доставки. Адаптація моделі під параметри
      Покупця можлива за попереднім погодженням з менеджером.
    </p>

    <h2>5. Ціна та оплата</h2>
    <p>5.1. Ціни зазначаються в гривнях. Ціною Товару є ціна, вказана на Сайті або підтверджена менеджером на момент оформлення замовлення.</p>
    <p>5.2. Способи оплати:</p>
    <ul className="dash">
      <li>карткою онлайн на Сайті (Visa, Mastercard, Apple Pay, Google Pay) — після підключення платіжного сервісу;</li>
      <li>безготівковий переказ на поточний рахунок Продавця за реквізитами, зазначеними в розділі 12;</li>
      <li>
        накладений платіж з обовʼязковою передоплатою не менше {PREPAY_MIN} грн; розмір передоплати Покупець обирає самостійно, решта
        сплачується при отриманні;
      </li>
      <li>подарунковим сертифікатом CORSO.</li>
    </ul>
    <p>5.3. Вартість доставки не входить у ціну Товару і сплачується Покупцем за тарифами перевізника.</p>

    <h2>6. Доставка</h2>
    <p>6.1. Доставка здійснюється по Україні службою «Нова пошта» — у відділення, поштомат або адресно курʼєром. Можливий самовивіз з магазину Продавця: {site.city}, {site.address}.</p>
    <p>6.2. Відправка — протягом 1–2 робочих днів після підтвердження замовлення та, за потреби, оплати або передоплати.</p>
    <p>
      6.3. Покупець зобовʼязаний оглянути Товар під час отримання у відділенні перевізника. Право власності та ризики випадкового пошкодження
      переходять до Покупця з моменту отримання Товару.
    </p>

    <h2>7. Повернення та обмін</h2>
    <p>
      7.1. Повернення та обмін Товару належної якості здійснюються протягом 14 календарних днів відповідно до Закону України «Про захист прав
      споживачів» на умовах, викладених на сторінці <Link href="/info/obmin-i-povernennia">«Обмін і повернення»</Link>.
    </p>
    <p>7.2. Витрати на доставку під час повернення або обміну оплачує Покупець.</p>
    <p>7.3. Повернення коштів здійснюється на рахунок або картку Покупця після отримання та перевірки Товару Продавцем.</p>

    <h2>8. Права та обовʼязки сторін</h2>
    <p>8.1. Продавець зобовʼязується передати Товар, що відповідає опису та замовленню, і надати Покупцю інформацію, необхідну для його придбання.</p>
    <p>8.2. Покупець зобовʼязується своєчасно оплатити та отримати Товар і ознайомитися з умовами цієї оферти до оформлення замовлення.</p>

    <h2>9. Відповідальність</h2>
    <p>9.1. Сторони несуть відповідальність за невиконання умов договору відповідно до законодавства України.</p>
    <p>9.2. Продавець не відповідає за затримки доставки з вини перевізника та за обставини непереборної сили.</p>

    <h2>10. Персональні дані</h2>
    <p>
      10.1. Оформлюючи замовлення, Покупець дає згоду на обробку своїх персональних даних відповідно до Закону України «Про захист персональних
      даних» з метою виконання замовлення. Детальніше — у <Link href="/info/konfidentsiinist">Політиці конфіденційності</Link>.
    </p>

    <h2>11. Інші умови</h2>
    <p>11.1. Спори вирішуються шляхом переговорів, а в разі недосягнення згоди — у порядку, встановленому законодавством України.</p>

    <h2>12. Реквізити Продавця</h2>
    <RequisitesUk />
    <p>
      Магазин: {site.city}, {site.address}. Замовлення та питання: <Manager>звʼязок з менеджером у Telegram</Manager>. Instagram: <Insta />.
    </p>
  </>
);
export const OfferEn = (
  <>
    <p className="muted small">Version of 25 November 2026. The Ukrainian version prevails.</p>

    <h2>1. General provisions</h2>
    <p>
      1.1. This agreement is a public offer by {L.nameEn} ({L.name}, the «Seller») under Articles 633 and 641 of the Civil Code of Ukraine and
      sets out the terms of sale of CORSO goods through the CORSO online store (the «Site»), through our manager on Telegram and in the
      Seller&apos;s store.
    </p>
    <p>1.2. The offer is accepted by placing an order on the Site or through the manager, or by paying for the goods. From that moment the agreement is concluded on the terms below.</p>
    <p>1.3. The Seller may change the terms of the offer. The version published on the Site at the time of the order applies.</p>

    <h2>2. Definitions</h2>
    <ul className="dash">
      <li>«Buyer» — an individual who places an order on the Site, through the manager or in the Seller&apos;s store.</li>
      <li>«Goods» — CORSO women&apos;s clothing and accessories presented on the Site.</li>
      <li>«Order» — the Buyer&apos;s duly placed request to buy Goods.</li>
    </ul>

    <h2>3. Subject</h2>
    <p>3.1. The Seller undertakes to transfer the Goods into the Buyer&apos;s ownership, and the Buyer undertakes to accept and pay for them under this agreement.</p>
    <p>3.2. Goods in photos may differ slightly from the original due to screen settings. Description, composition and sizes are given on the product page.</p>

    <h2>4. Placing an order</h2>
    <p>4.1. The Buyer orders on the Site, through the CORSO manager on Telegram or in the Seller&apos;s store.</p>
    <p>4.2. The Buyer provides accurate contact and delivery details. The Seller is not liable for the consequences of inaccurate details.</p>
    <p>4.3. After the order is placed the manager confirms availability, size, price and delivery. Adapting a piece to the Buyer&apos;s measurements is possible by prior agreement with the manager.</p>

    <h2>5. Price and payment</h2>
    <p>5.1. Prices are in hryvnias. The price of the Goods is the price shown on the Site or confirmed by the manager when the order is placed.</p>
    <p>5.2. Payment methods:</p>
    <ul className="dash">
      <li>by card online on the Site (Visa, Mastercard, Apple Pay, Google Pay) — once the payment service is connected;</li>
      <li>bank transfer to the Seller&apos;s account using the details in section 12;</li>
      <li>cash on delivery with a mandatory prepayment of at least {PREPAY_MIN} UAH; the Buyer chooses the prepayment amount, the rest is paid on delivery;</li>
      <li>a CORSO gift certificate.</li>
    </ul>
    <p>5.3. Delivery is not included in the price and is paid by the Buyer at the carrier&apos;s rates.</p>

    <h2>6. Delivery</h2>
    <p>6.1. Delivery within Ukraine by Nova Poshta — to a branch, a parcel locker or by courier. Pickup from the Seller&apos;s store is available: {site.addressEn}, {site.cityEn}.</p>
    <p>6.2. Dispatch within 1–2 business days after the order is confirmed and, where required, paid or prepaid.</p>
    <p>6.3. The Buyer must inspect the Goods when collecting them at the carrier&apos;s branch. Ownership and risk pass to the Buyer upon receipt.</p>

    <h2>7. Returns and exchanges</h2>
    <p>
      7.1. Goods of proper quality may be returned or exchanged within 14 calendar days under the Law of Ukraine «On Consumer Protection» on the
      terms set out on the <Link href="/info/obmin-i-povernennia">Exchange &amp; Return</Link> page.
    </p>
    <p>7.2. Shipping costs for returns and exchanges are paid by the Buyer.</p>
    <p>7.3. Refunds are made to the Buyer&apos;s account or card after the Seller receives and inspects the Goods.</p>

    <h2>8. Rights and obligations</h2>
    <p>8.1. The Seller delivers Goods matching the description and the order and gives the Buyer the information needed for the purchase.</p>
    <p>8.2. The Buyer pays for and collects the Goods on time and reads this offer before ordering.</p>

    <h2>9. Liability</h2>
    <p>9.1. The parties are liable for breach of this agreement under Ukrainian law.</p>
    <p>9.2. The Seller is not liable for delivery delays caused by the carrier or for force majeure.</p>

    <h2>10. Personal data</h2>
    <p>
      10.1. By placing an order the Buyer consents to the processing of personal data under the Law of Ukraine «On Personal Data Protection» to
      fulfil the order. See the <Link href="/info/konfidentsiinist">Privacy Policy</Link>.
    </p>

    <h2>11. Other terms</h2>
    <p>11.1. Disputes are settled by negotiation and, failing agreement, in accordance with Ukrainian law.</p>

    <h2>12. Seller details</h2>
    <RequisitesEn />
    <p>
      Store: {site.addressEn}, {site.cityEn}. Orders and questions: <Manager>contact our manager on Telegram</Manager>. Instagram: <Insta />.
    </p>
  </>
);

/* ---------------- privacy ---------------- */
export const PrivacyUk = (
  <>
    <p>
      Володілець персональних даних — {L.name} (РНОКПП {L.ipn}). Ми обробляємо дані відповідно до Закону України «Про захист персональних
      даних».
    </p>
    <h2>Які дані ми отримуємо</h2>
    <p>Імʼя, телефон, e-mail, адресу або відділення доставки, параметри фігури (для підбору та адаптації розміру), історію замовлень.</p>
    <h2>Навіщо</h2>
    <p>Щоб прийняти, підтвердити й доставити замовлення, підібрати розмір, оформити повернення чи обмін та звʼязатися з вами.</p>
    <h2>Кому передаємо</h2>
    <p>Лише службі доставки та платіжному сервісу — в обсязі, потрібному для виконання замовлення. Третім особам для реклами дані не передаються.</p>
    <h2>Ваші права</h2>
    <p>
      Ви можете попросити переглянути, виправити або видалити свої дані — <Manager>напишіть менеджеру CORSO</Manager>.
    </p>
  </>
);
export const PrivacyEn = (
  <>
    <p>
      The personal data controller is {L.nameEn} ({L.name}, tax ID {L.ipn}). We process data under the Law of Ukraine «On Personal Data
      Protection».
    </p>
    <h2>What we collect</h2>
    <p>Name, phone, e-mail, delivery address or branch, body measurements (to choose and adapt the size) and order history.</p>
    <h2>Why</h2>
    <p>To accept, confirm and deliver your order, choose the size, handle returns or exchanges and contact you.</p>
    <h2>Who we share it with</h2>
    <p>Only the delivery service and the payment provider — as far as needed to fulfil the order. We never pass data to third parties for advertising.</p>
    <h2>Your rights</h2>
    <p>
      You can ask to see, correct or delete your data — <Manager>message the CORSO manager</Manager>.
    </p>
  </>
);
