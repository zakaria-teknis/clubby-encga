import { useState } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
import {
  BsPersonPlusFill,
  BsSearch,
  BsArrowDown,
  BsArrowUp,
} from "react-icons/bs";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useMembersStore } from "../../../store/dashboard/members";
import { useUserStore } from "../../../store/user";

export default function MembersTableHeader({ displayInfo }) {
  const { setShowAddMemberModal, members, setOrderedMembers } =
    useMembersStore();
  const { user } = useUserStore();
  const isLoading = useMembersStore(
    (state) => state.loadingStates["MembersTable"]
  );

  const [search, setSearch] = useState("");

  const handleSortByDateAdded = (direction) => {
    let orderedMembers = [...members];

    orderedMembers = orderedMembers.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    });

    setOrderedMembers(orderedMembers);
  };

  const handleSortByAlphabet = (direction) => {
    let orderedMembers = [...members];

    orderedMembers = orderedMembers.sort((a, b) => {
      const nameA = a.first_name.toLowerCase();
      const nameB = b.first_name.toLowerCase();
      return direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setOrderedMembers(orderedMembers);
  };

  const handleSortByMembershipFee = (status) => {
    let orderedMembers = [...members];

    orderedMembers = orderedMembers.filter(
      (member) => member.paid_membership_fee === status
    );

    orderedMembers.sort((a, b) => a.first_name.localeCompare(b.first_name));

    setOrderedMembers(orderedMembers);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);

    const searchTerm = e.target.value;
    let orderedMembers = [...members];

    orderedMembers = orderedMembers.filter((member) => {
      const firstName = member.first_name?.toLowerCase() || "";
      const lastName = member.last_name?.toLowerCase() || "";
      const phone = member.phone
        ? member.phone.toString().startsWith("0")
          ? member.phone.toString()
          : "0" + member.phone.toString()
        : "";
      const email = member.email?.toLowerCase() || "";

      return (
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        email.includes(searchTerm)
      );
    });

    setOrderedMembers(orderedMembers);
  };

  const userIsEditor = () => {
    return user.role.some((role) => role === "editor");
  };

  const addMemberDisabled = () => {
    return userIsEditor() && members && members.length >= 120;
  };

  return (
    <div className="d-flex justify-content-between flex-column flex-sm-row mx-4 mb-3 gap-3">
      <div
        className="w-100 d-flex align-items-center border rounded ps-2"
        style={{ width: "fit-content", height: "fit-content" }}>
        <BsSearch />
        <Form.Control
          plaintext
          value={search}
          disabled={isLoading}
          onChange={(e) => handleSearch(e)}
          className="border-0 ps-2"
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="d-flex gap-3 flex-shrink-0">
        <Dropdown>
          <Dropdown.Toggle
            variant="light"
            disabled={isLoading}
            id="dropdown-basic">
            Sort Members
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByDateAdded("asc")}>
              <span>Date added</span>
              <BsArrowUp />
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByDateAdded("desc")}>
              <span>Date added</span>
              <BsArrowDown />
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByAlphabet("asc")}>
              <span>Alphabet</span>
              <BsArrowUp />
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByAlphabet("desc")}>
              <span>Alphabet</span>
              <BsArrowDown />
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByMembershipFee("paid")}>
              <span>Membership Fee</span>
              <FaCheck />
            </Dropdown.Item>

            <Dropdown.Item
              className="d-flex align-items-center gap-1"
              onClick={() => handleSortByMembershipFee("unpaid")}>
              <span>Membership Fee</span>
              <FaXmark />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {userIsEditor() && (
          <Button
            variant="light"
            onClick={() => setShowAddMemberModal(true)}
            disabled={isLoading || addMemberDisabled()}
            className="d-flex align-items-center justify-content-center gap-1"
            style={{ height: "fit-content" }}>
            <BsPersonPlusFill size={20} />
            <span>Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}
