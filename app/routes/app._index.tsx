import {
  Page,
  Card,
  TextField,
  Button,
  Select,
  Banner,
  InlineGrid,
} from "@shopify/polaris";
import { useState } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import prisma from "../db.server";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { BogoRule } from "@prisma/client";

// loader برای نمایش لیست Ruleها
export async function loader({ request }: any) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const rules = await prisma.bogoRule.findMany({ where: { shop } });
  return json({ rules });
}

// action برای افزودن Rule جدید
export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  await prisma.bogoRule.create({
    data: {
      shop,
      triggerProductId: form.get("triggerProductId") as string,
      rewardProductId: form.get("rewardProductId") as string,
      requiredQty: Number(form.get("requiredQty")),
      rewardQty: Number(form.get("rewardQty")),
      discountType: form.get("discountType") as string,
    },
  });

  return json({ success: true });
}

export default function BogoPage() {
  const { rules } = useLoaderData<typeof loader>();
  const [form, setForm] = useState({
    triggerProductId: "",
    rewardProductId: "",
    requiredQty: "1",
    rewardQty: "1",
    discountType: "free",
  });

  const actionData = useActionData();

  const handleChange = (field: string) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Page title="BOGO Rules">
      {actionData?.success && <Banner status="success">Rule added successfully</Banner>}
      <Card>
        <form method="post">
          <InlineGrid columns={2} gap="400">
            <TextField
              label="Trigger Product ID"
              name="triggerProductId"
              value={form.triggerProductId}
              onChange={handleChange("triggerProductId")}
              autoComplete="off"
            />
            <TextField
              label="Reward Product ID"
              name="rewardProductId"
              value={form.rewardProductId}
              onChange={handleChange("rewardProductId")}
              autoComplete="off"
            />
            <TextField
              label="Required Quantity"
              name="requiredQty"
              type="number"
              value={form.requiredQty}
              onChange={handleChange("requiredQty")}
              autoComplete="off"
            />
            <TextField
              label="Reward Quantity"
              name="rewardQty"
              type="number"
              value={form.rewardQty}
              onChange={handleChange("rewardQty")}
              autoComplete="off"
            />
            <Select
              label="Discount Type"
              name="discountType"
              options={[
                { label: "Free", value: "free" },
                { label: "Percentage", value: "percent" },
                { label: "Fixed Amount", value: "fixed" },
              ]}
              value={form.discountType}
              onChange={handleChange("discountType")}
            />
          </InlineGrid>
          <Button submit variant="primary" fullWidth>
            Add Rule
          </Button>
        </form>
      </Card>

      {rules.map((rule: BogoRule) => (
        <Card key={rule.id}>
            <strong>BOGO Rule</strong>
            <br />
            Trigger: {rule.triggerProductId} → Reward: {rule.rewardProductId}
            <br />
            Qty: {rule.requiredQty} → {rule.rewardQty}
            <br />
            Type: {rule.discountType}
        </Card>
      ))}
    </Page>
  );
}
