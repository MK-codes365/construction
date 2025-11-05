import { PageHeader } from '@/components/page-header';
import { WasteLogForm } from '@/components/waste-log-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LogWastePage() {
  return (
    <>
      <PageHeader
        title="Log New Waste"
        description="Fill out the form to record a new waste entry."
      />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Waste Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <WasteLogForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
