import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";

const AddModalToken2 = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn primary-btn rounded-sm">Add Token</button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <h2 className="text-lg font-semibold">Modal Title</h2>
        </DialogHeader>

        {/* Main content goes here */}
        <div className="my-4">
          <p>Your content here...</p>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddModalToken2;
